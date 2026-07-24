import os
import json
import urllib.request
import sys
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import spacy
import hmac
from datetime import datetime
import yfinance as yf
import numpy as np
from dotenv import load_dotenv

# Resolve the path to apps/ai_engine dynamically
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ai_engine"))

# Try loading from possible locations
load_dotenv()
load_dotenv("../web/.env")
load_dotenv("../api/.env")
load_dotenv("../../apps/web/.env")
load_dotenv("../../apps/api/.env")

app = FastAPI()

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split(" ")[1]
    
    # 1. Check if token is a shared secret for internal microservice calls
    internal_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("INTERNAL_API_KEY")
    if internal_key and hmac.compare_digest(token, internal_key):
        return
        
    # 2. Otherwise, verify via Supabase Auth API
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if not supabase_url or not supabase_anon_key:
        raise HTTPException(status_code=500, detail="Supabase environment configuration missing")
    
    try:
        req_obj = urllib.request.Request(
            f"{supabase_url.rstrip('/')}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": supabase_anon_key
            }
        )
        with urllib.request.urlopen(req_obj, timeout=5) as response:
            if response.status == 200:
                user_info = json.loads(response.read().decode())
                return user_info
            else:
                raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Load models on startup
try:
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Warning: Could not load SentenceTransformer: {e}")
    embedder = None

try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print(f"Warning: Could not load spacy model: {e}")
    nlp = None

class QueryRequest(BaseModel):
    text: str

class EmbedRequest(BaseModel):
    text: str

class BacktestRequest(BaseModel):
    symbol: str
    start_date: str
    end_date: str
    strategy_logic: dict = None

@app.get("/health")
def health():
    return {
        "status": "ok", 
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": embedder is not None and nlp is not None
    }

@app.post("/api/embed", dependencies=[Depends(verify_token)])
def get_embedding(req: EmbedRequest):
    if not embedder:
        raise HTTPException(status_code=503, detail="Embedder model not loaded")
    embedding = embedder.encode(req.text).tolist()
    return {"embedding": embedding}

@app.post("/api/parse_query", dependencies=[Depends(verify_token)])
def parse_query(req: QueryRequest):
    if not nlp:
        raise HTTPException(status_code=503, detail="NLP model not loaded")

    text = req.text.lower()
    entities = []

    if "nifty" in text or "banknifty" in text or "options" in text:
        entities.append({"type": "INSTRUMENT", "value": "Options"})
    if "safe" in text or "low risk" in text:
        entities.append({"type": "RISK_LEVEL", "value": "Low Risk"})
    if "under 50k" in text or "50k" in text:
        entities.append({"type": "CAPITAL", "value": "Under ₹50K"})
    if "intraday" in text:
        entities.append({"type": "TIME_HORIZON", "value": "Intraday"})

    embedding = []
    if embedder:
        embedding = embedder.encode(req.text).tolist()

    return {
        "query": req.text,
        "entities": entities,
        "embedding": embedding,
        "tsvector_fallback": " | ".join([e['value'].lower() for e in entities]) or text.replace(" ", " | ")
    }

@app.post("/api/backtest", dependencies=[Depends(verify_token)])
def run_backtest(req: BacktestRequest):
    try:
        import pandas as pd
        from agents.intent_parser import StrategySchema, Indicator
        from engine.backtester import VectorBacktester

        # 1. Fetch Data
        df = yf.download(req.symbol, start=req.start_date, end=req.end_date)
        if df.empty:
            raise HTTPException(status_code=400, detail="No data found for the given symbol and date range")

        # 2. Parse / Construct Strategy Schema
        if not req.strategy_logic:
            strategy = StrategySchema(
                market=req.symbol,
                timeframe="1d",
                indicators=[
                    Indicator(name="SMA", period=9),
                    Indicator(name="SMA", period=21)
                ],
                entry_logic=["close > SMA_21"],
                exit_logic=["close < SMA_21"],
                stop_loss_atr=2.0
            )
        else:
            strategy = StrategySchema(**req.strategy_logic)

        # VectorBacktester expects lowercase columns
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        df.columns = [col.lower() for col in df.columns]

        # 3. Instantiate and run indicator/signals parser
        bt = VectorBacktester(strategy=strategy, df=df)
        bt.apply_indicators()
        bt.generate_signals()

        # 4. Trailing stop-loss & position logic
        df['position'] = 0.0
        current_pos = 0.0
        entry_price = 0.0
        
        positions = np.zeros(len(df))
        closes = df['close'].values
        atrs = df['atr'].values
        entries = df['entry_signal'].values
        exits = df['exit_signal'].values
        
        stop_mult = strategy.stop_loss_atr
        stop_price = 0.0

        for i in range(1, len(df)):
            if current_pos == 0:
                if entries[i-1]:
                    current_pos = 1
                    entry_price = closes[i]
                    stop_price = entry_price - (atrs[i-1] * stop_mult)
            elif current_pos == 1:
                new_stop = closes[i] - (atrs[i-1] * stop_mult)
                if new_stop > stop_price:
                    stop_price = new_stop
                if exits[i-1] or closes[i] <= stop_price:
                    current_pos = 0
            
            positions[i] = current_pos

        df['position'] = positions

        # Calculate Returns
        df['market_return'] = df['close'].pct_change()
        df['strategy_return'] = df['position'].shift(1) * df['market_return']
        
        # 5. Calculate Metrics
        total_return = (df['strategy_return'].fillna(0) + 1).prod() - 1
        cagr = (total_return + 1) ** (252 / len(df)) - 1 if len(df) > 0 else 0
        
        # Max Drawdown
        cum_returns = (df['strategy_return'].fillna(0) + 1).cumprod()
        running_max = cum_returns.cummax()
        drawdown = (cum_returns - running_max) / running_max
        max_drawdown = drawdown.min()
        
        # Sharpe Ratio
        sharpe = np.sqrt(252) * df['strategy_return'].mean() / df['strategy_return'].std() if df['strategy_return'].std() != 0 else 0
        
        # Sortino Ratio
        downside_returns = df.loc[df['strategy_return'] < 0, 'strategy_return']
        downside_std = downside_returns.std()
        sortino = np.sqrt(252) * df['strategy_return'].mean() / downside_std if downside_std != 0 and not np.isnan(downside_std) else 0

        # Calculate Trades from Position changes
        trade_log = []
        trades_won = 0
        total_profit = 0
        total_loss = 0
        
        position = 0 # 0 = flat, 1 = long
        entry_price = 0.0
        entry_time = None
        
        for idx, row in df.iterrows():
            pos = float(row['position']) if not np.isnan(row['position']) else 0.0
            close_price = float(row['close']) if not np.isnan(row['close']) else 0.0
            date_str = idx.strftime('%Y-%m-%d')
            
            if pos == 1.0 and position == 0:
                position = 1
                entry_price = close_price
                entry_time = date_str
            elif pos == 0.0 and position == 1:
                position = 0
                pnl = (close_price - entry_price) * 100
                pnl_pct = (close_price - entry_price) / entry_price * 100
                
                trade_log.append({
                    "entry_time": entry_time,
                    "exit_time": date_str,
                    "entry_price": round(entry_price, 2),
                    "exit_price": round(close_price, 2),
                    "pnl": round(pnl, 2),
                    "pnl_pct": round(pnl_pct, 2)
                })
                
                if pnl > 0:
                    trades_won += 1
                    total_profit += pnl
                else:
                    total_loss += abs(pnl)
        
        if position == 1:
            last_row = df.iloc[-1]
            close_price = float(last_row['close'])
            date_str = df.index[-1].strftime('%Y-%m-%d')
            pnl = (close_price - entry_price) * 100
            pnl_pct = (close_price - entry_price) / entry_price * 100
            trade_log.append({
                "entry_time": entry_time,
                "exit_time": date_str,
                "entry_price": round(entry_price, 2),
                "exit_price": round(close_price, 2),
                "pnl": round(pnl, 2),
                "pnl_pct": round(pnl_pct, 2)
            })
            if pnl > 0:
                trades_won += 1
                total_profit += pnl
            else:
                total_loss += abs(pnl)

        total_trades = len(trade_log)
        win_rate = round((trades_won / total_trades) * 100, 2) if total_trades > 0 else 0.0
        profit_factor = round(total_profit / total_loss, 2) if total_loss > 0 else (round(total_profit, 2) if total_profit > 0 else 1.0)

        # 4. Format Results
        equity_curve = cum_returns.fillna(1.0).reset_index()
        equity_curve.columns = ['date', 'value']
        equity_curve['date'] = equity_curve['date'].dt.strftime('%Y-%m-%d')
        equity_curve['value'] = equity_curve['value'] * 100000
        
        results = {
            "status": "completed",
            "metrics": {
                "cagr": round(cagr * 100, 2),
                "total_return": round(total_return * 100, 2),
                "max_drawdown": round(max_drawdown * 100, 2),
                "sharpe_ratio": round(sharpe, 2),
                "sortino_ratio": round(sortino, 2),
                "win_rate": win_rate,
                "profit_factor": profit_factor
            },
            "equity_curve": equity_curve.to_dict(orient='records'),
            "trade_log": trade_log
        }
        
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

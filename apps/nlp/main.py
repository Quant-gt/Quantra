import os
import json
import urllib.request
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import spacy
from datetime import datetime
import yfinance as yf
import numpy as np
from dotenv import load_dotenv

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
    if internal_key and token == internal_key:
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
        # 1. Fetch Data
        df = yf.download(req.symbol, start=req.start_date, end=req.end_date)
        if df.empty:
            raise HTTPException(status_code=400, detail="No data found for the given symbol and date range")

        # 2. Simulate Strategy (Simple Moving Average Crossover for demonstration)
        # In real app, this would evaluate the req.strategy_logic DAG
        df['SMA_fast'] = df['Close'].rolling(window=9).mean()
        df['SMA_slow'] = df['Close'].rolling(window=21).mean()
        
        df['Signal'] = 0
        df.loc[df['SMA_fast'] > df['SMA_slow'], 'Signal'] = 1
        df['Position'] = df['Signal'].shift(1)
        
        # Calculate Returns
        df['Market_Return'] = df['Close'].pct_change()
        df['Strategy_Return'] = df['Market_Return'] * df['Position']
        
        # 3. Calculate Metrics
        total_return = (df['Strategy_Return'] + 1).prod() - 1
        cagr = (total_return + 1) ** (252 / len(df)) - 1 if len(df) > 0 else 0
        
        # Max Drawdown
        cum_returns = (df['Strategy_Return'] + 1).cumprod()
        running_max = cum_returns.cummax()
        drawdown = (cum_returns - running_max) / running_max
        max_drawdown = drawdown.min()
        
        # Sharpe Ratio
        sharpe = np.sqrt(252) * df['Strategy_Return'].mean() / df['Strategy_Return'].std() if df['Strategy_Return'].std() != 0 else 0
        
        # Sortino Ratio
        downside_returns = df.loc[df['Strategy_Return'] < 0, 'Strategy_Return']
        downside_std = downside_returns.std()
        sortino = np.sqrt(252) * df['Strategy_Return'].mean() / downside_std if downside_std != 0 and not np.isnan(downside_std) else 0

        # Calculate Trades from Position changes
        trade_log = []
        trades_won = 0
        total_profit = 0
        total_loss = 0
        
        position = 0 # 0 = flat, 1 = long
        entry_price = 0.0
        entry_time = None
        
        for idx, row in df.iterrows():
            pos = float(row['Position']) if not np.isnan(row['Position']) else 0.0
            close_price = float(row['Close']) if not np.isnan(row['Close']) else 0.0
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
            close_price = float(last_row['Close'])
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

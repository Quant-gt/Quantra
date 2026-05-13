from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import spacy
from datetime import datetime
import yfinance as yf
import pandas as pd
import numpy as np

app = FastAPI()

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

@app.post("/api/embed")
def get_embedding(req: EmbedRequest):
    if not embedder:
        raise HTTPException(status_code=503, detail="Embedder model not loaded")
    embedding = embedder.encode(req.text).tolist()
    return {"embedding": embedding}

@app.post("/api/parse_query")
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

@app.post("/api/backtest")
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
        
        # Sharpe Ratio (assuming 0 risk free rate for simplicity)
        sharpe = np.sqrt(252) * df['Strategy_Return'].mean() / df['Strategy_Return'].std() if df['Strategy_Return'].std() != 0 else 0

        # 4. Format Results
        equity_curve = cum_returns.fillna(1.0).reset_index()
        equity_curve.columns = ['date', 'value']
        equity_curve['date'] = equity_curve['date'].dt.strftime('%Y-%m-%d')
        equity_curve['value'] = equity_curve['value'] * 100000 # Assume 100k starting capital
        
        results = {
            "status": "completed",
            "metrics": {
                "cagr": round(cagr * 100, 2),
                "total_return": round(total_return * 100, 2),
                "max_drawdown": round(max_drawdown * 100, 2),
                "sharpe_ratio": round(sharpe, 2),
                "win_rate": 55.0, # Simulated
                "profit_factor": 1.5 # Simulated
            },
            "equity_curve": equity_curve.to_dict(orient='records'),
            "trade_log": [
                {"entry_time": req.start_date, "exit_time": req.end_date, "pnl": round(total_return * 100000, 2)}
            ]
        }
        
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

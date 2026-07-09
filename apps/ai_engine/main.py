import asyncio
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.intent_parser import parse_intent, StrategySchema
from market_data import start_fyers_websocket, get_latest_prices
from fyers_auth import get_fyers_login_url, generate_token_from_auth_code, get_fyers_access_token
from engine.async_executor import run_execution_loop
from core.symbol_resolver import SymbolResolver
from fyers_apiv3 import fyersModel
import yfinance as yf

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from auto_auth_agent import run_automated_login

app = FastAPI(title="The I.N.D.I.A. Engine by SigmaSpire", description="Intelligent Network for Dynamic Investment Analytics - Multi-Agent Strategy Generator & Backtester")

# Global In-Memory Order Queue
order_queue = asyncio.Queue()

@app.on_event("startup")
async def startup_event():
    # Start the Fyers WebSocket connection in the background
    start_fyers_websocket()
    
    # Spawn the persistent async execution worker
    asyncio.create_task(run_execution_loop(order_queue))

    # Schedule the automated headless auth agent at 8:45 AM every day
    scheduler = AsyncIOScheduler()
    scheduler.add_job(run_automated_login, 'cron', hour=8, minute=45)
    scheduler.start()
    print("Started APScheduler for 8:45 AM Auto-Auth Agent")

# Allow requests from the Next.js frontend
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins, # No wildcard when credentials are true
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StrategyPromptRequest(BaseModel):
    prompt: str

@app.get("/api/v1/fyers/login_url")
async def get_login_url():
    url = get_fyers_login_url()
    if not url:
        raise HTTPException(status_code=500, detail="Fyers App ID not configured")
    return {"url": url}

@app.get("/api/v1/fyers/callback")
async def fyers_callback(auth_code: str = None, s: str = None, code: str = None):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    # Fyers sometimes sends auth_code, sometimes just code
    actual_code = auth_code or code
    if not actual_code:
        return RedirectResponse(f"{frontend_url}/admin/broker?error=no_code")
    try:
        generate_token_from_auth_code(actual_code)
        # Start Fyers live WebSocket feed since we now have a valid token
        start_fyers_websocket()
        return RedirectResponse(f"{frontend_url}/admin/broker?success=true")
    except Exception as e:
        return RedirectResponse(f"{frontend_url}/admin/broker?error={str(e)}")

@app.post("/api/v1/generate", response_model=StrategySchema)
async def generate_strategy(request: StrategyPromptRequest):
    try:
        # Phase 2: Parse the natural language prompt into structured JSON
        strategy_schema = await parse_intent(request.prompt)
        return strategy_schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/optimize")
async def optimize_strategy(strategy: StrategySchema):
    try:
        # Phase 4: Optimize strategy parameters
        from engine.optimizer import StrategyOptimizer
        optimizer = StrategyOptimizer(strategy)
        # We run 30 trials for a quick optimization pass
        results = optimizer.run_optimization(n_trials=30)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/market/stream")
async def market_stream():
    # If the Fyers feed hasn't populated yet (or credentials are missing), 
    # instantly return 503 so the frontend's EventSource.onerror triggers the Yahoo fallback.
    if not get_latest_prices():
        raise HTTPException(status_code=503, detail="Fyers live feed is not connected or missing credentials.")

    async def event_generator():
        while True:
            # Yield the latest cached prices every second
            prices = get_latest_prices()
            if prices:
                yield f"data: {json.dumps({'stocks': prices})}\n\n"
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai_engine"}

@app.get("/api/v1/market/history")
async def get_market_history(symbol: str, resolution: str, range_from: str, range_to: str):
    # Try Fyers
    access_token = get_fyers_access_token()
    app_id = os.getenv("FYERS_APP_ID")
    
    # 1. Fyers Fetching
    if access_token and app_id:
        try:
            fyers_sym = SymbolResolver.resolve_to_fyers(symbol)
            fyers = fyersModel.FyersModel(client_id=app_id, token=access_token, log_path="./")
            data = {
                "symbol": fyers_sym,
                "resolution": resolution,
                "date_format": "1",
                "range_from": range_from,
                "range_to": range_to,
                "cont_flag": "1"
            }
            res = fyers.history(data=data)
            if res and res.get("s") == "ok":
                candles = []
                for c in res.get("candles", []):
                    candles.append({
                        "time": c[0], # epoch
                        "open": c[1],
                        "high": c[2],
                        "low": c[3],
                        "close": c[4],
                        "volume": c[5]
                    })
                return {"candles": candles, "source": "fyers"}
        except Exception as e:
            print(f"Fyers history query failed: {e}. Falling back to Yahoo...")

    # 2. Yahoo Finance Fallback
    try:
        import requests
        from datetime import datetime
        import time

        yahoo_sym = SymbolResolver.resolve_to_yahoo(symbol)
        
        # Map TV resolution to Yahoo interval
        interval = "1d"
        if resolution == "1":
            interval = "1m"
        elif resolution == "5":
            interval = "5m"
        elif resolution == "15":
            interval = "15m"
        elif resolution == "30":
            interval = "30m"
        elif resolution == "60":
            interval = "1h"
        elif resolution == "D":
            interval = "1d"
        elif resolution == "W":
            interval = "1wk"

        p1 = int(datetime.strptime(range_from, "%Y-%m-%d").timestamp())
        p2 = int(time.time()) # Use current time to get the latest intraday candles

        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{yahoo_sym}?period1={p1}&period2={p2}&interval={interval}"
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        if res.status_code == 200:
            chart_data = res.json()
            result = chart_data.get("chart", {}).get("result", [None])[0]
            if result:
                timestamps = result.get("timestamp", [])
                quote = result.get("indicators", {}).get("quote", [{}])[0]
                opens = quote.get("open", [])
                highs = quote.get("high", [])
                lows = quote.get("low", [])
                closes = quote.get("close", [])
                volumes = quote.get("volume", [])

                candles = []
                for i in range(len(timestamps)):
                    if (opens[i] is not None and highs[i] is not None and 
                        lows[i] is not None and closes[i] is not None):
                        candles.append({
                            "time": timestamps[i],
                            "open": float(opens[i]),
                            "high": float(highs[i]),
                            "low": float(lows[i]),
                            "close": float(closes[i]),
                            "volume": int(volumes[i]) if volumes[i] is not None else 0
                        })
                if candles:
                    return {"candles": candles, "source": "yahoo"}
    except Exception as e:
        print(f"Yahoo HTTP fallback query failed: {e}")
        
    raise HTTPException(status_code=500, detail="Failed to fetch history from all sources")

@app.get("/")
def read_root():
    return RedirectResponse(url="/health")

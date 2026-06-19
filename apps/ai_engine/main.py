import asyncio
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.intent_parser import parse_intent, StrategySchema
from market_data import start_fyers_websocket, get_latest_prices
from fyers_auth import get_fyers_login_url, generate_token_from_auth_code
from engine.async_executor import run_execution_loop

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from auto_auth_agent import run_automated_login

app = FastAPI(title="Quantra AI Engine", description="Multi-Agent Strategy Generator & Backtester")

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

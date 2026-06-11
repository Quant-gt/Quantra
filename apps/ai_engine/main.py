import asyncio
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.intent_parser import parse_intent, StrategySchema
from market_data import start_fyers_websocket, get_latest_prices
from fyers_auth import get_fyers_login_url, generate_token_from_auth_code
from engine.async_executor import run_execution_loop

app = FastAPI(title="Quantra AI Engine", description="Multi-Agent Strategy Generator & Backtester")

# Global In-Memory Order Queue
order_queue = asyncio.Queue()

@app.on_event("startup")
async def startup_event():
    # Start the Fyers WebSocket connection in the background
    start_fyers_websocket()
    
    # Spawn the persistent async execution worker
    asyncio.create_task(run_execution_loop(order_queue))

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the actual Vercel domain
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
    # Fyers sometimes sends auth_code, sometimes just code
    actual_code = auth_code or code
    if not actual_code:
        return RedirectResponse("http://localhost:3000/admin/broker?error=no_code")
    try:
        generate_token_from_auth_code(actual_code)
        return RedirectResponse("http://localhost:3000/admin/broker?success=true")
    except Exception as e:
        return RedirectResponse(f"http://localhost:3000/admin/broker?error={str(e)}")

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

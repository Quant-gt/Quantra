from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.intent_parser import parse_intent, StrategySchema

app = FastAPI(title="Quantra AI Engine", description="Multi-Agent Strategy Generator & Backtester")

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

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai_engine"}

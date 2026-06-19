from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import asyncio
from datetime import datetime

# Import scrapegraphai lazily to avoid crash if not installed
try:
    from scrapegraphai.graphs import SmartScraperGraph
except ImportError:
    SmartScraperGraph = None

app = FastAPI()

class ScrapeRequest(BaseModel):
    url: str
    prompt: str

@app.get("/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "scrapegraph_available": SmartScraperGraph is not None
    }

@app.post("/api/scrape")
async def scrape(req: ScrapeRequest):
    if not SmartScraperGraph:
        raise HTTPException(status_code=503, detail="ScrapeGraphAI not installed or failed to load")
    
    # ScrapeGraphAI requires an LLM to function. Using NVIDIA API as requested.
    api_key = os.environ.get("NVIDIA_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="NVIDIA_API_KEY environment variable is missing")

    graph_config = {
        "llm": {
            "api_key": api_key,
            "model": "openai/meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
        },
    }

    try:
        smart_scraper_graph = SmartScraperGraph(
            prompt=req.prompt,
            source=req.url,
            config=graph_config
        )
        # Offload the heavy synchronous scraping execution to a background worker thread
        result = await asyncio.to_thread(smart_scraper_graph.run)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

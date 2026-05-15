from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
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
def scrape(req: ScrapeRequest):
    if not SmartScraperGraph:
        raise HTTPException(status_code=503, detail="ScrapeGraphAI not installed or failed to load")
    
    # ScrapeGraphAI requires an LLM to function. Using Gemini as requested.
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY or GOOGLE_API_KEY environment variable is missing")

    graph_config = {
        "llm": {
            "api_key": api_key,
            "model": "gemini-1.5-flash",
        },
    }

    try:
        smart_scraper_graph = SmartScraperGraph(
            prompt=req.prompt,
            source=req.url,
            config=graph_config
        )
        result = smart_scraper_graph.run()
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

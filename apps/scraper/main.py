from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
import os
import json
import urllib.request
import asyncio
import hmac
from datetime import datetime
from dotenv import load_dotenv

# Try loading from possible locations
load_dotenv()
load_dotenv("../web/.env")
load_dotenv("../api/.env")
load_dotenv("../../apps/web/.env")
load_dotenv("../../apps/api/.env")

# Import scrapegraphai lazily to avoid crash if not installed
try:
    from scrapegraphai.graphs import SmartScraperGraph
except ImportError:
    SmartScraperGraph = None

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

@app.post("/api/scrape", dependencies=[Depends(verify_token)])
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

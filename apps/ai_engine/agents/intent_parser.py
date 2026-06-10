import os
import json
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from openai import AsyncOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup Nvidia API via OpenAI Client
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
client = AsyncOpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_API_KEY
)

class Indicator(BaseModel):
    name: str = Field(description="Name of the indicator, e.g., 'SMA', 'RSI', 'EMA'")
    period: int = Field(description="Lookback period for the indicator")
    parameters: Dict[str, Any] = Field(default={}, description="Additional parameters like overbought/oversold levels")

class StrategySchema(BaseModel):
    market: str = Field(description="Market scope, e.g., 'NSE_EQ', 'NSE_IDX'")
    timeframe: str = Field(description="Timeframe, e.g., '1d', '1h', '15m'")
    indicators: List[Indicator] = Field(description="List of required indicators")
    entry_logic: List[str] = Field(description="List of entry conditions in pseudocode")
    exit_logic: List[str] = Field(description="List of exit conditions in pseudocode")
    stop_loss_atr: float = Field(default=2.0, description="ATR multiplier for trailing stop loss")

async def parse_intent(prompt: str) -> StrategySchema:
    """
    Parses a human-readable trading strategy prompt into a structured StrategySchema.
    """
    system_prompt = f"""
    You are an expert quantitative trading architect for the Indian Stock Market (NSE/BSE).
    Your task is to parse the user's trading strategy description into a structured JSON object.
    
    You MUST output valid JSON that conforms exactly to the following Pydantic schema:
    {StrategySchema.model_json_schema()}
    
    Rules:
    - Default market to 'NSE_EQ' unless an index is specified (then use 'NSE_IDX').
    - Default timeframe to '1d' if not specified.
    - Always include a stop_loss_atr (default 2.0) even if the user doesn't specify one, as a risk guardrail.
    - Output ONLY JSON.
    """

    response = await client.chat.completions.create(
        model="meta/llama-3.1-70b-instruct",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=1024,
    )

    result_text = response.choices[0].message.content.strip()
    
    # Sometimes models wrap JSON in markdown blocks
    if result_text.startswith("```json"):
        result_text = result_text[7:-3].strip()
    elif result_text.startswith("```"):
        result_text = result_text[3:-3].strip()

    parsed_dict = json.loads(result_text)
    return StrategySchema(**parsed_dict)

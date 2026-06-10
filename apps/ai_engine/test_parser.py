import asyncio
from agents.intent_parser import parse_intent

async def main():
    prompt = "I want to buy Nifty 50 when it crosses above its 50-day moving average and the RSI is below 30. Sell when RSI goes above 70. Put a trailing stop loss of 2.5x ATR."
    print(f"Testing Prompt: '{prompt}'")
    try:
        result = await parse_intent(prompt)
        print("\nSuccessfully parsed JSON:")
        print(result.model_dump_json(indent=2))
    except Exception as e:
        print(f"\nError: {e}")

if __name__ == "__main__":
    asyncio.run(main())

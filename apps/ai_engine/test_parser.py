import pytest
from unittest.mock import patch, MagicMock
from agents.intent_parser import parse_intent
from agents.intent_parser import parse_intent

@pytest.mark.asyncio
async def test_parse_intent_basic():
    prompt = "I want to buy Nifty 50 when it crosses above its 50-day moving average and the RSI is below 30. Sell when RSI goes above 70. Put a trailing stop loss of 2.5x ATR."
    
    with patch('agents.intent_parser.client.chat.completions.create') as mock_create:
        # Mock the LLM returning a valid JSON string
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = '''
        {
            "market": "NSE_IDX",
            "timeframe": "1d",
            "indicators": [
                {"name": "SMA", "period": 50, "parameters": {}},
                {"name": "RSI", "period": 14, "parameters": {}}
            ],
            "entry_logic": ["close > SMA_50", "RSI_14 < 30"],
            "exit_logic": ["RSI_14 > 70"],
            "stop_loss_atr": 2.5
        }
        '''
        
        # client.chat.completions.create is async, so mock it returning an awaitable
        async def mock_coro(*args, **kwargs):
            return mock_response
        mock_create.side_effect = mock_coro
        
        result = await parse_intent(prompt)
        
        assert result.market == "NSE_IDX"
        assert result.timeframe == "1d"
        assert len(result.indicators) == 2
        assert result.stop_loss_atr == 2.5

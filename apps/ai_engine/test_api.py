import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_get_login_url():
    with patch("main.get_fyers_login_url", return_value="https://api.fyers.in/login"):
        response = client.get("/api/v1/fyers/login_url")
        assert response.status_code == 200
        assert response.json() == {"url": "https://api.fyers.in/login"}

def test_get_login_url_missing():
    with patch("main.get_fyers_login_url", return_value=None):
        response = client.get("/api/v1/fyers/login_url")
        assert response.status_code == 500
        assert "not configured" in response.json()["detail"]

def test_fyers_callback_missing_code():
    response = client.get("/api/v1/fyers/callback", follow_redirects=False)
    assert response.status_code == 307
    assert "error=no_code" in response.headers["location"]

@patch("main.generate_token_from_auth_code")
@patch("main.start_fyers_websocket")
def test_fyers_callback_success(mock_start_ws, mock_generate_token):
    response = client.get("/api/v1/fyers/callback?auth_code=dummy_code", follow_redirects=False)
    assert response.status_code == 307
    assert "success=true" in response.headers["location"]
    mock_generate_token.assert_called_once_with("dummy_code")
    mock_start_ws.assert_called_once()

@patch("main.generate_token_from_auth_code")
def test_fyers_callback_exception(mock_generate_token):
    mock_generate_token.side_effect = Exception("Invalid code")
    response = client.get("/api/v1/fyers/callback?auth_code=dummy_code", follow_redirects=False)
    assert response.status_code == 307
    assert "error=Invalid%20code" in response.headers["location"]

@patch("main.parse_intent")
def test_generate_strategy(mock_parse_intent):
    from agents.intent_parser import StrategySchema
    mock_schema = StrategySchema(
        market="NSE_IDX", timeframe="1d", indicators=[], entry_logic=[], exit_logic=[], stop_loss_atr=2.5
    )
    # mock_parse_intent is async, so we need to return a coroutine
    async def mock_coro(*args, **kwargs):
        return mock_schema
    mock_parse_intent.side_effect = mock_coro

    response = client.post("/api/v1/generate", json={"prompt": "Buy Nifty"})
    assert response.status_code == 200
    assert response.json()["market"] == "NSE_IDX"

def test_market_stream_no_prices():
    with patch("main.get_latest_prices", return_value={}):
        response = client.get("/api/v1/market/stream")
        assert response.status_code == 503
        assert "not connected" in response.json()["detail"]

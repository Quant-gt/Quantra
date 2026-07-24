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

def test_optimize_strategy_success():
    mock_strategy = {
        "market": "NSE_IDX",
        "timeframe": "1d",
        "indicators": [],
        "entry_logic": [],
        "exit_logic": [],
        "stop_loss_atr": 2.5
    }
    with patch("engine.optimizer.StrategyOptimizer") as mock_optimizer_class:
        mock_instance = mock_optimizer_class.return_value
        mock_instance.run_optimization.return_value = {"best_params": {"stop_loss_atr": 2.2}}
        
        response = client.post("/api/v1/optimize", json=mock_strategy)
        assert response.status_code == 200
        assert response.json() == {"best_params": {"stop_loss_atr": 2.2}}
        mock_optimizer_class.assert_called_once()
        mock_instance.run_optimization.assert_called_once_with(n_trials=30)

def test_optimize_strategy_failure():
    mock_strategy = {
        "market": "NSE_IDX",
        "timeframe": "1d",
        "indicators": [],
        "entry_logic": [],
        "exit_logic": [],
        "stop_loss_atr": 2.5
    }
    with patch("engine.optimizer.StrategyOptimizer") as mock_optimizer_class:
        mock_instance = mock_optimizer_class.return_value
        mock_instance.run_optimization.side_effect = Exception("Optimization failed")
        
        response = client.post("/api/v1/optimize", json=mock_strategy)
        assert response.status_code == 500
        assert response.json()["detail"] == "Optimization failed"

@patch("main.get_fyers_access_token")
@patch("main.SymbolResolver")
@patch("main.fyersModel.FyersModel")
@patch("main.os.getenv")
def test_get_market_history_fyers_success(mock_getenv, mock_fyers_class, mock_resolver, mock_get_token):
    mock_get_token.return_value = "dummy_token"
    mock_getenv.return_value = "dummy_app_id"
    mock_resolver.resolve_to_fyers.return_value = "NSE:NIFTY50-INDEX"
    
    mock_fyers = mock_fyers_class.return_value
    mock_fyers.history.return_value = {
        "s": "ok",
        "candles": [
            [1672531200, 18000, 18100, 17900, 18050, 1000]
        ]
    }
    
    response = client.get("/api/v1/market/history?symbol=NIFTY&resolution=D&range_from=2023-01-01&range_to=2023-01-02")
    assert response.status_code == 200
    assert response.json()["source"] == "fyers"
    assert len(response.json()["candles"]) == 1
    assert response.json()["candles"][0]["open"] == 18000.0
    mock_resolver.resolve_to_fyers.assert_called_once_with("NIFTY")

@patch("main.get_fyers_access_token")
@patch("main.SymbolResolver")
@patch("requests.get")
@patch("main.os.getenv")
def test_get_market_history_yahoo_fallback(mock_getenv, mock_requests_get, mock_resolver, mock_get_token):
    # Fyers fails or is unconfigured
    mock_get_token.return_value = None
    mock_getenv.return_value = None
    
    mock_resolver.resolve_to_yahoo.return_value = "^NSEI"
    
    # Mock Yahoo Finance response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "chart": {
            "result": [
                {
                    "timestamp": [1672531200],
                    "indicators": {
                        "quote": [
                            {
                                "open": [18000],
                                "high": [18100],
                                "low": [17900],
                                "close": [18050],
                                "volume": [1000]
                            }
                        ]
                    }
                }
            ]
        }
    }
    mock_requests_get.return_value = mock_response
    
    response = client.get("/api/v1/market/history?symbol=NIFTY&resolution=D&range_from=2023-01-01&range_to=2023-01-02")
    assert response.status_code == 200
    assert response.json()["source"] == "yahoo"
    assert len(response.json()["candles"]) == 1
    assert response.json()["candles"][0]["open"] == 18000.0
    mock_resolver.resolve_to_yahoo.assert_called_once_with("NIFTY")

@patch("main.get_fyers_access_token")
@patch("main.SymbolResolver")
@patch("requests.get")
@patch("main.os.getenv")
def test_get_market_history_failure(mock_getenv, mock_requests_get, mock_resolver, mock_get_token):
    mock_get_token.return_value = None
    mock_getenv.return_value = None
    
    # Yahoo fails as well
    mock_response = MagicMock()
    mock_response.status_code = 500
    mock_requests_get.return_value = mock_response
    
    response = client.get("/api/v1/market/history?symbol=NIFTY&resolution=D&range_from=2023-01-01&range_to=2023-01-02")
    assert response.status_code == 500
    assert "Failed to fetch history" in response.json()["detail"]

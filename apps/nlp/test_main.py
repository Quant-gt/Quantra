import os
import json
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import pandas as pd

# Set env vars before importing main so that internal_key is set during load if needed
os.environ["INTERNAL_API_KEY"] = "test-internal-key"

# Mock load_dotenv to prevent OSError on Windows when parsing complex .env files
with patch("dotenv.load_dotenv"):
    from main import app, verify_token

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data
    assert "models_loaded" in data

@patch.dict(os.environ, {"INTERNAL_API_KEY": "test-internal-key"})
def test_verify_token_missing_header():
    response = client.post("/api/embed", json={"text": "hello"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Missing or invalid Authorization header"

@patch.dict(os.environ, {"INTERNAL_API_KEY": "test-internal-key"})
def test_verify_token_invalid_header_format():
    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "InvalidFormat token"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Missing or invalid Authorization header"

@patch.dict(os.environ, {"INTERNAL_API_KEY": "test-internal-key"})
def test_verify_token_internal_key():
    # Because embedder might not be loaded in tests, we expect a 503 instead of 401
    # which means auth succeeded but service is unavailable. 
    # Or if it is loaded, a 200. Let's just check it's not 401.
    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer test-internal-key"})
    assert response.status_code != 401

@patch.dict(os.environ, {}, clear=True)
def test_verify_token_supabase_missing_env():
    # Without internal key and without supabase env vars
    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer some-token"})
    assert response.status_code == 500
    assert response.json()["detail"] == "Supabase environment configuration missing"

@patch.dict(os.environ, {"NEXT_PUBLIC_SUPABASE_URL": "http://supabase.local", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "anon-key"})
@patch("urllib.request.urlopen")
def test_verify_token_supabase_valid(mock_urlopen):
    # Mock successful supabase response
    mock_response = MagicMock()
    mock_response.status = 200
    mock_response.read.return_value = json.dumps({"id": "user123"}).encode("utf-8")
    mock_response.__enter__.return_value = mock_response
    mock_urlopen.return_value = mock_response

    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer valid-token"})
    assert response.status_code != 401

@patch.dict(os.environ, {"NEXT_PUBLIC_SUPABASE_URL": "http://supabase.local", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "anon-key"})
@patch("urllib.request.urlopen")
def test_verify_token_supabase_invalid(mock_urlopen):
    # Mock failed supabase response
    mock_response = MagicMock()
    mock_response.status = 401
    mock_response.read.return_value = json.dumps({"error": "invalid"}).encode("utf-8")
    mock_response.__enter__.return_value = mock_response
    mock_urlopen.return_value = mock_response

    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"

@patch.dict(os.environ, {"NEXT_PUBLIC_SUPABASE_URL": "http://supabase.local", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "anon-key"})
@patch("urllib.request.urlopen", side_effect=Exception("Network error"))
def test_verify_token_supabase_exception(mock_urlopen):
    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"

# --- NEW TESTS ---

@patch("main.embedder")
def test_get_embedding(mock_embedder):
    mock_embedder.encode.return_value.tolist.return_value = [0.1, 0.2, 0.3]
    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer test-internal-key"})
    assert response.status_code == 200
    assert response.json()["embedding"] == [0.1, 0.2, 0.3]

@patch("main.embedder", None)
def test_get_embedding_model_not_loaded():
    response = client.post("/api/embed", json={"text": "hello"}, headers={"Authorization": "Bearer test-internal-key"})
    assert response.status_code == 503
    assert response.json()["detail"] == "Embedder model not loaded"

@patch("main.nlp")
@patch("main.embedder")
def test_parse_query_success(mock_embedder, mock_nlp):
    mock_embedder.encode.return_value.tolist.return_value = [0.1]
    
    # Test multiple conditions from the parse_query logic
    payload = {"text": "Safe Nifty options trading under 50k for intraday"}
    response = client.post("/api/parse_query", json=payload, headers={"Authorization": "Bearer test-internal-key"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == payload["text"]
    assert data["embedding"] == [0.1]
    
    entities = data["entities"]
    types = [e["type"] for e in entities]
    assert "INSTRUMENT" in types
    assert "RISK_LEVEL" in types
    assert "CAPITAL" in types
    assert "TIME_HORIZON" in types

@patch("main.nlp", None)
def test_parse_query_no_nlp():
    response = client.post("/api/parse_query", json={"text": "hello"}, headers={"Authorization": "Bearer test-internal-key"})
    assert response.status_code == 503
    assert response.json()["detail"] == "NLP model not loaded"

@patch("yfinance.download")
def test_run_backtest_empty_dataframe(mock_yf_download):
    # Mock yfinance returning an empty dataframe
    mock_yf_download.return_value = pd.DataFrame()
    
    payload = {
        "symbol": "FAKE_STOCK",
        "start_date": "2023-01-01",
        "end_date": "2023-01-31"
    }
    
    response = client.post("/api/backtest", json=payload, headers={"Authorization": "Bearer test-internal-key"})
    assert response.status_code == 400
    assert "No data found" in response.json()["detail"]

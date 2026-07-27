import os
import json
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

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

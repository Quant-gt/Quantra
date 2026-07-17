import pytest
import os
from unittest.mock import patch, AsyncMock
from auto_auth_agent import run_automated_login

@pytest.mark.asyncio
async def test_run_automated_login_missing_creds():
    with patch.dict(os.environ, {"FYERS_CLIENT_ID": "", "FYERS_TOTP_KEY": "", "FYERS_PIN": ""}):
        result = await run_automated_login()
        assert result is False

@pytest.mark.asyncio
async def test_run_automated_login_missing_login_url():
    with patch.dict(os.environ, {"FYERS_CLIENT_ID": "X", "FYERS_TOTP_KEY": "Y", "FYERS_PIN": "Z"}):
        with patch("auto_auth_agent.get_fyers_login_url", return_value=None):
            result = await run_automated_login()
            assert result is False

@pytest.mark.asyncio
async def test_run_automated_login_success():
    with patch.dict(os.environ, {"FYERS_CLIENT_ID": "X", "FYERS_TOTP_KEY": "JBSWY3DPEHPK3PXP", "FYERS_PIN": "1234"}):
        with patch("auto_auth_agent.get_fyers_login_url", return_value="https://login"):
            with patch("auto_auth_agent.async_playwright") as mock_playwright:
                # Setup mock browser flow
                mock_page = AsyncMock()
                mock_page.url = "http://localhost:3000/api/v1/fyers/callback?auth_code=mock_code"
                
                mock_context = AsyncMock()
                mock_context.new_page.return_value = mock_page
                
                mock_browser = AsyncMock()
                mock_browser.new_context.return_value = mock_context
                
                mock_p = AsyncMock()
                mock_p.chromium.launch.return_value = mock_browser
                
                # Mock async with context manager
                mock_playwright.return_value.__aenter__.return_value = mock_p
                
                with patch("auto_auth_agent.generate_token_from_auth_code") as mock_gen_token:
                    result = await run_automated_login()
                    assert result is True
                    mock_gen_token.assert_called_once_with("mock_code")

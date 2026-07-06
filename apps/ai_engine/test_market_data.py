import unittest
from unittest.mock import MagicMock, patch
import os
import sys

# Add current directory to path to allow importing local modules correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import market_data
from core.symbol_resolver import SymbolResolver

class TestMarketData(unittest.TestCase):

    def setUp(self):
        # Reset global state before each test
        market_data.LATEST_PRICES.clear()
        market_data._ws_instance = None
        market_data._is_connected = False

    def test_onmessage_valid_symbol(self):
        # Setup a mock message matching a symbol mapped in SymbolResolver
        message = {
            "symbol": "NSE:RELIANCE-EQ",
            "ltp": 2500.0,
            "prev_close_price": 2450.0
        }
        
        market_data.onmessage(message)
        
        prices = market_data.get_latest_prices()
        self.assertEqual(len(prices), 1)
        self.assertEqual(prices[0]["name"], "RELIANCE")
        self.assertEqual(prices[0]["price"], "2,500.00")
        self.assertEqual(prices[0]["change"], "+2.04%")
        self.assertTrue(prices[0]["up"])

    def test_onmessage_invalid_symbol(self):
        # Test receiving a symbol not mapped in SymbolResolver
        message = {
            "symbol": "UNKNOWN",
            "ltp": 100.0,
            "prev_close_price": 100.0
        }
        market_data.onmessage(message)
        prices = market_data.get_latest_prices()
        self.assertEqual(len(prices), 0)

    @patch('market_data.get_fyers_access_token')
    def test_start_fyers_websocket_missing_token(self, mock_get_token):
        mock_get_token.return_value = None
        
        with patch('fyers_apiv3.FyersWebsocket.data_ws.FyersDataSocket') as mock_ws_class:
            market_data.start_fyers_websocket()
            mock_ws_class.assert_not_called()
            self.assertFalse(market_data._is_connected)

    @patch('market_data.get_fyers_access_token')
    def test_start_fyers_websocket_success(self, mock_get_token):
        import uuid
        dynamic_app_id = os.environ.get("FYERS_APP_ID", f"app_id_{uuid.uuid4().hex[:8]}")
        dynamic_token = os.environ.get("FYERS_ACCESS_TOKEN", f"token_{uuid.uuid4().hex[:12]}")
        
        mock_get_token.return_value = dynamic_token
        
        # Mock the FyersDataSocket instance
        mock_ws_instance = MagicMock()
        
        with patch.dict(os.environ, {"FYERS_APP_ID": dynamic_app_id}):
            with patch('fyers_apiv3.FyersWebsocket.data_ws.FyersDataSocket') as mock_ws_class:
                mock_ws_class.return_value = mock_ws_instance
                
                market_data.start_fyers_websocket()
                
                # Should initialize FyersDataSocket and spin off background thread
                mock_ws_class.assert_called_once()
                self.assertEqual(market_data._ws_instance, mock_ws_instance)

    def test_onopen_subscribes_symbols(self):
        # Setup mock ws instance
        mock_ws = MagicMock()
        market_data._ws_instance = mock_ws
        
        market_data.onopen()
        
        self.assertTrue(market_data._is_connected)
        # Should subscribe to all keys defined in SymbolResolver.MAP
        expected_symbols = list(SymbolResolver.MAP.keys())
        mock_ws.subscribe.assert_called_once_with(
            data_type="SymbolUpdate",
            symbol=expected_symbols
        )

    def test_onclose(self):
        market_data._is_connected = True
        market_data.onclose("closed")
        self.assertFalse(market_data._is_connected)

if __name__ == '__main__':
    unittest.main()

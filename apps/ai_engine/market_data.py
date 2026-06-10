import threading
import time
import json
from fyers_apiv3.FyersWebsocket import data_ws
from .fyers_auth import get_fyers_access_token
import os

# Global dictionary to cache the latest prices
LATEST_PRICES = {}
_ws_instance = None

# Mapping Fyers symbols to UI names
SYMBOL_MAP = {
    "NSE:NIFTY50-INDEX": "NIFTY 50",
    "BSE:SENSEX-INDEX": "SENSEX",
    "NSE:RELIANCE-EQ": "RELIANCE",
    "NSE:TCS-EQ": "TCS",
    "NSE:HDFCBANK-EQ": "HDFCBANK"
}

def onmessage(message):
    """Callback function when a new tick is received"""
    if "symbol" in message:
        symbol = message["symbol"]
        if symbol in SYMBOL_MAP:
            name = SYMBOL_MAP[symbol]
            ltp = message.get("ltp", 0.0)
            prev_close = message.get("prev_close_price", ltp)
            
            # Calculate change percent safely to avoid division by zero
            change_pct = 0.0
            if prev_close > 0:
                change_pct = ((ltp - prev_close) / prev_close) * 100
                
            LATEST_PRICES[name] = {
                "name": name,
                "price": f"{ltp:,.2f}",
                "change": f"{'+' if change_pct >= 0 else ''}{change_pct:.2f}%",
                "up": change_pct >= 0
            }

def onerror(message):
    print(f"Fyers WebSocket Error: {message}")

def onclose(message):
    print(f"Fyers WebSocket Closed: {message}")

def onopen():
    print("Fyers WebSocket Connected. Subscribing to symbols...")
    symbols = list(SYMBOL_MAP.keys())
    # data_type = "SymbolUpdate" -> Subscribe for live ticks
    _ws_instance.subscribe(data_type="SymbolUpdate", symbol=symbols)

def start_fyers_websocket():
    global _ws_instance
    access_token = get_fyers_access_token()
    if not access_token:
        print("Could not retrieve Fyers Access Token. WebSocket will not start.")
        return

    # Fyers API v3 data socket requires the App ID and Access Token concatenated
    app_id = os.getenv("FYERS_APP_ID")
    ws_token = f"{app_id}:{access_token}"

    _ws_instance = data_ws.FyersDataSocket(
        access_token=ws_token,
        log_path="./",
        litemode=False,
        write_to_file=False,
        reconnect=True,
        on_connect=onopen,
        on_close=onclose,
        on_error=onerror,
        on_message=onmessage
    )
    
    # Run the connection in a background thread so it doesn't block FastAPI
    ws_thread = threading.Thread(target=_ws_instance.connect, daemon=True)
    ws_thread.start()

def get_latest_prices():
    """Returns the cached latest prices formatted for the frontend"""
    return list(LATEST_PRICES.values())

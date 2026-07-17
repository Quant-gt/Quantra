import pytest
from core.symbol_resolver import SymbolResolver

def test_resolve_to_yahoo_from_fyers():
    assert SymbolResolver.resolve_to_yahoo("NSE:RELIANCE-EQ") == "RELIANCE.NS"
    assert SymbolResolver.resolve_to_yahoo("NSE:NIFTY50-INDEX") == "^NSEI"

def test_resolve_to_yahoo_from_display():
    assert SymbolResolver.resolve_to_yahoo("TCS") == "TCS.NS"
    assert SymbolResolver.resolve_to_yahoo("NIFTY 50") == "^NSEI"

def test_resolve_to_yahoo_fallback():
    assert SymbolResolver.resolve_to_yahoo("ITC") == "ITC.NS"
    assert SymbolResolver.resolve_to_yahoo("ITC.NS") == "ITC.NS"
    assert SymbolResolver.resolve_to_yahoo("NSE_IDX") == "^NSEI"

def test_resolve_to_display():
    assert SymbolResolver.resolve_to_display("NSE:HDFCBANK-EQ") == "HDFCBANK"
    assert SymbolResolver.resolve_to_display("^NSEI") == "NIFTY 50"
    assert SymbolResolver.resolve_to_display("UNKNOWN.NS") == "UNKNOWN"

def test_resolve_to_fyers():
    assert SymbolResolver.resolve_to_fyers("RELIANCE") == "NSE:RELIANCE-EQ"
    assert SymbolResolver.resolve_to_fyers("RELIANCE.NS") == "NSE:RELIANCE-EQ"
    assert SymbolResolver.resolve_to_fyers("^BSESN") == "BSE:SENSEX-INDEX"
    
def test_resolve_to_fyers_fallback():
    assert SymbolResolver.resolve_to_fyers("ITC") == "NSE:ITC-EQ"
    assert SymbolResolver.resolve_to_fyers("NIFTY50") == "NSE:NIFTY50-INDEX"
    assert SymbolResolver.resolve_to_fyers("BSE:SOMETHING-EQ") == "BSE:SOMETHING-EQ"

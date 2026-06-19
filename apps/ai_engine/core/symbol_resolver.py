class SymbolResolver:
    # Bidirectional mapping tables
    MAP = {
        "NSE:RELIANCE-EQ": {"yahoo": "RELIANCE.NS", "display": "RELIANCE"},
        "NSE:TCS-EQ": {"yahoo": "TCS.NS", "display": "TCS"},
        "NSE:HDFCBANK-EQ": {"yahoo": "HDFCBANK.NS", "display": "HDFCBANK"},
        "NSE:NIFTY50-INDEX": {"yahoo": "^NSEI", "display": "NIFTY 50"},
        "BSE:SENSEX-INDEX": {"yahoo": "^BSESN", "display": "SENSEX"}
    }

    @classmethod
    def resolve_to_yahoo(cls, symbol: str) -> str:
        """Resolves any format (Fyers, Display, or Yahoo) to Yahoo Finance ticker."""
        if symbol in cls.MAP:
            return cls.MAP[symbol]["yahoo"]
            
        for fyers_sym, data in cls.MAP.items():
            if symbol == data["yahoo"] or symbol.upper() == data["display"].upper():
                return data["yahoo"]
                
        # Default fallback
        if not symbol.endswith(".NS") and symbol != "^NSEI" and symbol != "^BSESN":
            if symbol == "NSE_IDX":
                return "^NSEI"
            return f"{symbol}.NS"
        return symbol

    @classmethod
    def resolve_to_display(cls, symbol: str) -> str:
        """Resolves any format to Frontend Display name."""
        if symbol in cls.MAP:
            return cls.MAP[symbol]["display"]
            
        for fyers_sym, data in cls.MAP.items():
            if symbol == data["yahoo"] or symbol.upper() == data["display"].upper():
                return data["display"]
                
        # Default fallback
        return symbol.replace(".NS", "").replace("^", "")

    @classmethod
    def resolve_to_fyers(cls, symbol: str) -> str:
        """Resolves any format to Fyers Symbol name."""
        for fyers_sym, data in cls.MAP.items():
            if symbol == fyers_sym or symbol == data["yahoo"] or symbol.upper() == data["display"].upper():
                return fyers_sym
        return symbol

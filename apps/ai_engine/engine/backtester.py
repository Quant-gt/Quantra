import pandas as pd
import numpy as np
import yfinance as yf
import numexpr as ne
import re
from agents.intent_parser import StrategySchema
from core.symbol_resolver import SymbolResolver

class VectorBacktester:
    def __init__(self, strategy: StrategySchema, start_date: str = "2020-01-01", df: pd.DataFrame = None):
        self.strategy = strategy
        self.start_date = start_date
        self.df = df if df is not None else pd.DataFrame()

    def fetch_data(self):
        """Fetches data from Yahoo Finance."""
        if not self.df.empty:
            return self.df
        # Resolve the asset/market to a Yahoo Finance ticker dynamically
        ticker = SymbolResolver.resolve_to_yahoo(self.strategy.market)
        print(f"Fetching data for {ticker} from {self.start_date}...")
        self.df = yf.download(ticker, start=self.start_date, interval=self.strategy.timeframe)
        # Flatten multi-level columns if any (yf returns MultiIndex sometimes)
        if isinstance(self.df.columns, pd.MultiIndex):
            self.df.columns = self.df.columns.get_level_values(0)
        
        self.df.columns = [col.lower() for col in self.df.columns]
        self.df.dropna(inplace=True)
        return self.df

    def _calculate_rsi(self, series: pd.Series, period: int) -> pd.Series:
        delta = series.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        # Handle division by zero safely
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        
        # Replace inf and NaN values where loss is 0
        rsi = rsi.where(loss > 0, np.where(gain > 0, 100.0, 50.0))
        return rsi

    def _calculate_atr(self, period: int = 14) -> pd.Series:
        high_low = self.df['high'] - self.df['low']
        high_close = np.abs(self.df['high'] - self.df['close'].shift())
        low_close = np.abs(self.df['low'] - self.df['close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        return true_range.rolling(period).mean()

    def apply_indicators(self):
        """Computes technical indicators requested by the LLM."""
        # 1. Guardrail: Market Regime Filter (200 SMA)
        self.df['regime_sma'] = self.df['close'].rolling(200).mean()
        
        # 2. Guardrail: ATR Stop Loss
        self.df['atr'] = self._calculate_atr(14)
        
        # 3. Dynamic Indicators from Schema
        for ind in self.strategy.indicators:
            name = ind.name.upper()
            period = ind.period
            col_name = f"{name}_{period}"
            
            if name == 'SMA':
                self.df[col_name] = self.df['close'].rolling(window=period).mean()
            elif name == 'EMA':
                self.df[col_name] = self.df['close'].ewm(span=period, adjust=False).mean()
            elif name == 'RSI':
                self.df[col_name] = self._calculate_rsi(self.df['close'], period)

        self.df.dropna(inplace=True)

    def _is_safe_expression(self, expr: str) -> bool:
        """Validates that expression strings contain only safe variables, operators, and constants."""
        expr = expr.strip()
        if not expr:
            return True

        # Extract all word tokens (variables / identifiers)
        words = re.findall(r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', expr)
        
        # Allowed keywords in numexpr logical operations
        allowed_keywords = {'and', 'or', 'not', 'True', 'False'}
        allowed_columns = set(self.df.columns)

        for word in words:
            if word in allowed_keywords:
                continue
            if word in allowed_columns:
                continue
            # If the token is not an allowed column or a logical operator, reject it!
            return False

        # Only allow safe mathematical and comparison symbols.
        # Explicitly ban dots, quotes, brackets, braces, semicolons, and double underscores.
        if not re.match(r'^[a-zA-Z0-9_\s<>=!&|~()\-+*/]+$', expr):
            return False

        return True

    def generate_signals(self):
        """Evaluates entry and exit logic using vectorized operations."""
        # Default all signals to False
        self.df['entry_signal'] = False
        self.df['exit_signal'] = False

        if not self.strategy.entry_logic:
            return
            
        # Parse logic into pandas eval strings
        try:
            # Let's map any case-insensitive variable or missing lookbacks in entry/exit logic strings to computed columns
            # E.g. if column is 'RSI_14' and logic has 'RSI < 30', rewrite as 'RSI_14 < 30'
            computed_cols = list(self.df.columns)
            
            def normalize_logic(logic_list):
                normalized_list = []
                for cond in logic_list:
                    normalized_cond = cond
                    # Loop through columns sorted by length descending so longer column names get replaced first
                    for col in sorted(computed_cols, key=len, reverse=True):
                        col_base = col.split('_')[0] if '_' in col else col
                        # Replace exact matches case-insensitively
                        # Replace e.g., "RSI_14" (case-insensitive) with exact "RSI_14"
                        normalized_cond = re.sub(re.escape(col), col, normalized_cond, flags=re.IGNORECASE)
                        # Replace e.g., "RSI" (case-insensitive base indicator) with "RSI_14" if not already followed by lookback
                        pattern = r'\b' + re.escape(col_base) + r'\b(?!\s*_\s*\d+)'
                        normalized_cond = re.sub(pattern, col, normalized_cond, flags=re.IGNORECASE)
                    normalized_list.append(normalized_cond)
                return normalized_list

            normalized_entry = [f"({cond})" for cond in normalize_logic(self.strategy.entry_logic)]
            normalized_exit = [f"({cond})" for cond in normalize_logic(self.strategy.exit_logic or [])]
            
            entry_condition_str = " & ".join(normalized_entry)
            exit_condition_str = " | ".join(normalized_exit) if normalized_exit else "False"
            
            # Security check: prevent expression injection
            if not self._is_safe_expression(entry_condition_str):
                raise ValueError(f"Security Alert: Unsafe characters or unrecognized identifiers detected in entry logic: {entry_condition_str}")
            if not self._is_safe_expression(exit_condition_str):
                raise ValueError(f"Security Alert: Unsafe characters or unrecognized identifiers detected in exit logic: {exit_condition_str}")

            # Use safe numexpr evaluation
            if entry_condition_str:
                self.df['entry_signal'] = ne.evaluate(entry_condition_str, local_dict=self.df.to_dict('series'))
            if exit_condition_str:
                self.df['exit_signal'] = ne.evaluate(exit_condition_str, local_dict=self.df.to_dict('series'))
                
        except Exception as e:
            # Raise descriptive error to be caught by optimizer/API instead of silent failure
            raise ValueError(
                f"Signal evaluation failed: {e}. "
                f"Original Entry Logic: {self.strategy.entry_logic}, "
                f"Normalized Entry: {entry_condition_str if 'entry_condition_str' in locals() else 'N/A'}, "
                f"Available Columns: {list(self.df.columns)}"
            )

        # Apply Guardrail: Only allow longs when close > 200 SMA
        self.df['entry_signal'] = self.df['entry_signal'] & (self.df['close'] > self.df['regime_sma'])

    def run_backtest(self) -> dict:
        """Executes the vectorised backtest and calculates metrics."""
        self.fetch_data()
        self.apply_indicators()
        self.generate_signals()

        # Vectorised Positions (1 for holding, 0 for cash)
        # Shift signals by 1 to execute on the next candle's open
        self.df['position'] = 0
        current_pos = 0
        entry_price = 0
        
        # For realistic stops, we need a slight iterative approach or a complex vectorised mask. 
        # A fast loop for position tracking with ATR stop:
        positions = np.zeros(len(self.df))
        closes = self.df['close'].values
        atrs = self.df['atr'].values
        entries = self.df['entry_signal'].values
        exits = self.df['exit_signal'].values
        
        stop_mult = self.strategy.stop_loss_atr
        stop_price = 0.0

        for i in range(1, len(self.df)):
            if current_pos == 0:
                if entries[i-1]:
                    current_pos = 1
                    entry_price = closes[i]
                    stop_price = entry_price - (atrs[i-1] * stop_mult)
            elif current_pos == 1:
                # Update trailing stop
                new_stop = closes[i] - (atrs[i-1] * stop_mult)
                if new_stop > stop_price:
                    stop_price = new_stop
                
                # Check exit or stop loss
                if exits[i-1] or closes[i] <= stop_price:
                    current_pos = 0
            
            positions[i] = current_pos

        self.df['position'] = positions
        
        # Calculate Returns
        self.df['market_returns'] = self.df['close'].pct_change()
        self.df['strategy_returns'] = self.df['position'].shift(1) * self.df['market_returns']
        
        cum_returns = (1 + self.df['strategy_returns'].fillna(0)).cumprod()
        total_return = cum_returns.iloc[-1] - 1 if len(cum_returns) > 0 else 0
        
        win_days = (self.df['strategy_returns'] > 0).sum()
        total_trade_days = (self.df['position'] == 1).sum()
        win_rate = win_days / total_trade_days if total_trade_days > 0 else 0

        # Calculate Max Drawdown
        roll_max = cum_returns.cummax()
        drawdown = cum_returns / roll_max - 1.0
        max_drawdown = drawdown.min()

        return {
            "market": self.strategy.market,
            "total_return_pct": round(total_return * 100, 2),
            "win_rate_pct": round(win_rate * 100, 2),
            "max_drawdown_pct": round(abs(max_drawdown) * 100, 2),
            "total_trading_days": int(total_trade_days),
            "guardrails_active": True
        }

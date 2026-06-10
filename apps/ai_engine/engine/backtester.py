import pandas as pd
import numpy as np
import yfinance as yf
from agents.intent_parser import StrategySchema

class VectorBacktester:
    def __init__(self, strategy: StrategySchema, start_date: str = "2020-01-01"):
        self.strategy = strategy
        self.start_date = start_date
        self.df = pd.DataFrame()

    def fetch_data(self):
        """Fetches data from Yahoo Finance."""
        # Map NSE index name to Yahoo Finance ticker
        ticker = "^NSEI" if self.strategy.market == "NSE_IDX" else "RELIANCE.NS" # Default fallback
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
        rs = gain / loss
        return 100 - (100 / (1 + rs))

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

    def generate_signals(self):
        """Evaluates entry and exit logic using vectorized operations."""
        # Default all signals to False
        self.df['entry_signal'] = False
        self.df['exit_signal'] = False

        if not self.strategy.entry_logic:
            return
            
        # Parse logic into pandas eval strings (Very basic parser for demo)
        # In a production system, a robust AST parser should map "RSI < 30" to "RSI_14 < 30"
        # Assuming the LLM uses exact column names we generated, or we map them.
        
        # Example hardcoded evaluation for safety during Phase 3 setup:
        # We will assume entry_logic contains valid python/pandas expressions referring to df columns
        try:
            # Combine all entry conditions with AND
            entry_condition_str = " and ".join(self.strategy.entry_logic)
            # Combine all exit conditions with OR
            exit_condition_str = " or ".join(self.strategy.exit_logic) if self.strategy.exit_logic else "False"
            
            # Use pandas eval if possible, but fallback to a safe namespace
            if entry_condition_str:
                self.df['entry_signal'] = self.df.eval(entry_condition_str)
            if exit_condition_str:
                self.df['exit_signal'] = self.df.eval(exit_condition_str)
                
        except Exception as e:
            print(f"Signal Evaluation Warning (using fallback): {e}")
            pass

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

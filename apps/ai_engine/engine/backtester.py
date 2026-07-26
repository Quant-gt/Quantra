import pandas as pd
import numpy as np
import yfinance as yf
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

    def _calculate_supertrend(self, period: int = 10, multiplier: float = 3.0) -> pd.Series:
        hl2 = (self.df['high'] + self.df['low']) / 2
        atr = self._calculate_atr(period)
        
        basic_ub = hl2 + multiplier * atr
        basic_lb = hl2 - multiplier * atr
        
        final_ub = basic_ub.copy()
        final_lb = basic_lb.copy()
        
        for i in range(1, len(self.df)):
            if basic_ub.iloc[i] < final_ub.iloc[i-1] or self.df['close'].iloc[i-1] > final_ub.iloc[i-1]:
                final_ub.iloc[i] = basic_ub.iloc[i]
            else:
                final_ub.iloc[i] = final_ub.iloc[i-1]
                
            if basic_lb.iloc[i] > final_lb.iloc[i-1] or self.df['close'].iloc[i-1] < final_lb.iloc[i-1]:
                final_lb.iloc[i] = basic_lb.iloc[i]
            else:
                final_lb.iloc[i] = final_lb.iloc[i-1]
                
        supertrend = pd.Series(index=self.df.index, dtype=float)
        for i in range(0, len(self.df)):
            if i == 0:
                supertrend.iloc[i] = final_ub.iloc[i]
                continue
                
            if supertrend.iloc[i-1] == final_ub.iloc[i-1]:
                if self.df['close'].iloc[i] > final_ub.iloc[i]:
                    supertrend.iloc[i] = final_lb.iloc[i]
                else:
                    supertrend.iloc[i] = final_ub.iloc[i]
            else:
                if self.df['close'].iloc[i] < final_lb.iloc[i]:
                    supertrend.iloc[i] = final_ub.iloc[i]
                else:
                    supertrend.iloc[i] = final_lb.iloc[i]
        return supertrend

    def _calculate_adx(self, period: int = 14) -> pd.Series:
        upmove = self.df['high'] - self.df['high'].shift(1)
        downmove = self.df['low'].shift(1) - self.df['low']
        
        plus_dm = np.where((upmove > downmove) & (upmove > 0), upmove, 0.0)
        minus_dm = np.where((downmove > upmove) & (downmove > 0), downmove, 0.0)
        
        tr = self._calculate_atr(1)
        tr_smooth = pd.Series(tr).ewm(alpha=1/period, adjust=False).mean()
        
        plus_di = 100 * pd.Series(plus_dm).ewm(alpha=1/period, adjust=False).mean() / tr_smooth
        minus_di = 100 * pd.Series(minus_dm).ewm(alpha=1/period, adjust=False).mean() / tr_smooth
        
        dx = 100 * np.abs(plus_di - minus_di) / (plus_di + minus_di)
        adx = pd.Series(dx).ewm(alpha=1/period, adjust=False).mean()
        return adx

    def _calculate_donchian(self, period: int = 20) -> tuple:
        upper = self.df['high'].rolling(window=period).max()
        lower = self.df['low'].rolling(window=period).min()
        return upper, lower

    def _calculate_obv(self) -> pd.Series:
        direction = np.sign(self.df['close'].diff())
        if len(direction) > 0:
            direction.iloc[0] = 0
        obv = (direction * self.df['volume']).cumsum()
        return obv

    def _calculate_pivots(self) -> tuple:
        prev_high = self.df['high'].shift(1)
        prev_low = self.df['low'].shift(1)
        prev_close = self.df['close'].shift(1)
        
        pivot = (prev_high + prev_low + prev_close) / 3
        r1 = 2 * pivot - prev_low
        s1 = 2 * pivot - prev_high
        return pivot, r1, s1

    def _calculate_orb(self, period: int = 15) -> tuple:
        dates = self.df.index.date
        orb_high = pd.Series(index=self.df.index, dtype=float)
        orb_low = pd.Series(index=self.df.index, dtype=float)
        
        for d in np.unique(dates):
            day_mask = (dates == d)
            day_df = self.df[day_mask]
            if not day_df.empty:
                val_high = day_df['high'].iloc[0]
                val_low = day_df['low'].iloc[0]
                orb_high.loc[day_mask] = val_high
                orb_low.loc[day_mask] = val_low
        return orb_high, orb_low

    def _calculate_fvg(self) -> tuple:
        bullish_gap = self.df['low'] - self.df['high'].shift(2)
        bearish_gap = self.df['low'].shift(2) - self.df['high']
        
        fvg_bull = np.where(bullish_gap > 0, bullish_gap, 0.0)
        fvg_bear = np.where(bearish_gap > 0, bearish_gap, 0.0)
        return pd.Series(fvg_bull, index=self.df.index), pd.Series(fvg_bear, index=self.df.index)

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
            elif name == 'SUPERTREND':
                self.df[col_name] = self._calculate_supertrend(period)
            elif name == 'ADX':
                self.df[col_name] = self._calculate_adx(period)
            elif name == 'DONCHIAN':
                upper, lower = self._calculate_donchian(period)
                self.df[f"DONCHIAN_UPPER_{period}"] = upper
                self.df[f"DONCHIAN_LOWER_{period}"] = lower
                self.df[col_name] = (upper + lower) / 2
            elif name == 'OBV':
                self.df[col_name] = self._calculate_obv()
            elif name == 'PIVOTS':
                pivot, r1, s1 = self._calculate_pivots()
                self.df[f"PIVOT_P_{period}"] = pivot
                self.df[f"PIVOT_R1_{period}"] = r1
                self.df[f"PIVOT_S1_{period}"] = s1
                self.df[col_name] = pivot
            elif name == 'BOLLINGER' or name == 'BOLLINGER BANDS':
                sma = self.df['close'].rolling(window=period).mean()
                std = self.df['close'].rolling(window=period).std()
                self.df[f"BOLLINGER_UPPER_{period}"] = sma + 2 * std
                self.df[f"BOLLINGER_LOWER_{period}"] = sma - 2 * std
                self.df[col_name] = sma
            elif name == 'VWAP':
                cum_vol = self.df['volume'].cumsum()
                cum_pv = (self.df['close'] * self.df['volume']).cumsum()
                self.df[col_name] = cum_pv / cum_vol
            elif name == 'STOCHASTIC':
                low_min = self.df['low'].rolling(window=period).min()
                high_max = self.df['high'].rolling(window=period).max()
                self.df[col_name] = 100 * (self.df['close'] - low_min) / (high_max - low_min)
            elif name == 'ORB' or name == 'ORB (OPENING RANGE BREAKOUT)':
                upper, lower = self._calculate_orb(period)
                self.df[f"ORB_HIGH_{period}"] = upper
                self.df[f"ORB_LOW_{period}"] = lower
                self.df[col_name] = upper
            elif name == 'FVG' or name == 'FVG (FAIR VALUE GAP)':
                bull, bear = self._calculate_fvg()
                self.df[f"FVG_BULL_{period}"] = bull
                self.df[f"FVG_BEAR_{period}"] = bear
                self.df[col_name] = bull

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
        if not re.match(r'^[a-zA-Z0-9_\s<>=!&|~()\-+*/.]+$', expr):
            return False

        return True

    def _safe_eval_series(self, expr: str) -> pd.Series:
        """AST-based safe evaluation of conditions returning a boolean pd.Series"""
        import ast
        import operator
        
        allowed_ops = {
            ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
            ast.Div: operator.truediv, ast.BitAnd: operator.and_, ast.BitOr: operator.or_,
            ast.Invert: operator.invert, ast.USub: operator.neg, ast.Not: operator.invert,
            ast.And: operator.and_, ast.Or: operator.or_, ast.Gt: operator.gt,
            ast.Lt: operator.lt, ast.GtE: operator.ge, ast.LtE: operator.le,
            ast.Eq: operator.eq, ast.NotEq: operator.ne
        }
        
        def _eval(node):
            if isinstance(node, ast.Constant):
                return node.value
            elif isinstance(node, ast.Name):
                if node.id in self.df.columns:
                    return self.df[node.id]
                elif node.id == "True":
                    return True
                elif node.id == "False":
                    return False
                raise ValueError(f"Unsafe or missing identifier: {node.id}")
            elif isinstance(node, ast.BinOp):
                return allowed_ops[type(node.op)](_eval(node.left), _eval(node.right))
            elif isinstance(node, ast.UnaryOp):
                return allowed_ops[type(node.op)](_eval(node.operand))
            elif isinstance(node, ast.Compare):
                left = _eval(node.left)
                for op, comparator in zip(node.ops, node.comparators):
                    left = allowed_ops[type(op)](left, _eval(comparator))
                return left
            elif isinstance(node, ast.BoolOp):
                op = node.op
                values = [_eval(v) for v in node.values]
                result = values[0]
                for val in values[1:]:
                    result = allowed_ops[type(op)](result, val)
                return result
            raise ValueError(f"Unsafe operation: {type(node)}")

        tree = ast.parse(expr, mode='eval')
        return _eval(tree.body)

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

            # Use safe AST evaluation
            if entry_condition_str:
                self.df['entry_signal'] = self._safe_eval_series(entry_condition_str)
            if exit_condition_str:
                self.df['exit_signal'] = self._safe_eval_series(exit_condition_str)
                
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
        
        # Guard against empty dataframe
        if len(self.df) == 0:
            return {
                "market": self.strategy.market,
                "total_return_pct": 0.0,
                "win_rate_pct": 0.0,
                "max_drawdown_pct": 0.0,
                "total_trading_days": 0
            }

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

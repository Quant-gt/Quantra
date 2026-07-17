import pytest
import pandas as pd
import numpy as np
from engine.backtester import VectorBacktester
from agents.intent_parser import StrategySchema, Indicator

@pytest.fixture
def dummy_data():
    dates = pd.date_range(start="2023-01-01", periods=250)
    df = pd.DataFrame(index=dates)
    df['open'] = np.random.uniform(100, 110, size=250)
    df['high'] = df['open'] + np.random.uniform(0, 2, size=250)
    df['low'] = df['open'] - np.random.uniform(0, 2, size=250)
    df['close'] = np.random.uniform(100, 110, size=250)
    df['volume'] = np.random.randint(1000, 5000, size=250)
    return df

class TestMathEvaluationEngine:

    def test_security_sanitization_blocks_malicious_code(self, dummy_data):
        """Test that the math evaluation engine blocks arbitrary code execution."""
        schema_malicious = StrategySchema(
            market="IBM",
            timeframe="1d",
            indicators=[Indicator(name="SMA", period=50)],
            entry_logic=["close > 50; import os; os.system('rm -rf /')"],
            exit_logic=["False"],
            stop_loss_atr=2.5
        )
        bt_malicious = VectorBacktester(strategy=schema_malicious, df=dummy_data.copy())
        
        with pytest.raises(ValueError, match="Security Alert: Unsafe characters or unrecognized identifiers detected in entry logic"):
            bt_malicious.run_backtest()

    def test_security_sanitization_blocks_dunder_methods(self, dummy_data):
        """Test that __class__ or __subclasses__ is blocked."""
        schema_malicious = StrategySchema(
            market="IBM",
            timeframe="1d",
            indicators=[Indicator(name="SMA", period=50)],
            entry_logic=["close > __class__"],
            exit_logic=["False"],
            stop_loss_atr=2.5
        )
        bt_malicious = VectorBacktester(strategy=schema_malicious, df=dummy_data.copy())
        
        with pytest.raises(ValueError, match="Security Alert:"):
            bt_malicious.run_backtest()

    def test_logic_normalization_and_numexpr_evaluation(self, dummy_data):
        """Test that the logic engine correctly evaluates mathematical conditions."""
        
        # Override some exact values for a predictable test
        df = dummy_data.copy()
        df['close'] = 150.0 
        
        schema = StrategySchema(
            market="IBM",
            timeframe="1d",
            indicators=[
                Indicator(name="SMA", period=50),
            ],
            # If close > 100, signal should be true.
            entry_logic=["close > 100"],
            exit_logic=["close < 100"],
            stop_loss_atr=2.5
        )
        
        bt = VectorBacktester(strategy=schema, df=df)
        
        # We need to manually calculate the regime SMA since it's a guardrail (close > regime_sma)
        # VectorBacktester forces 'close > regime_sma' in generate_signals. 
        # So let's just test generate_signals behavior if it passes guardrails.
        
        # Before calling run_backtest, we'll just test the signal generation
        bt.apply_indicators()
        
        # Ensure regime sma is lower than close so entry signal can trigger
        bt.df['regime_sma'] = 50.0 
        
        bt.generate_signals()
        
        # All rows should have True for entry_signal and False for exit_signal
        assert bt.df['entry_signal'].all() == True
        assert bt.df['exit_signal'].all() == False

    def test_complex_condition_parsing(self, dummy_data):
        """Test parsing of multiple conditions (AND logic)."""
        df = dummy_data.copy()
        
        schema = StrategySchema(
            market="IBM",
            timeframe="1d",
            indicators=[
                Indicator(name="SMA", period=50),
                Indicator(name="RSI", period=14),
            ],
            entry_logic=["close > SMA_50", "RSI_14 < 30"],
            exit_logic=["RSI_14 > 70"],
            stop_loss_atr=2.5
        )
        
        bt = VectorBacktester(strategy=schema, df=df)
        bt.apply_indicators()
        
        # Force the values
        bt.df['close'] = 150
        bt.df['SMA_50'] = 100
        bt.df['RSI_14'] = 20
        bt.df['regime_sma'] = 50 # Pass the regime guardrail
        
        bt.generate_signals()
        
        # We expect entry to be True (150 > 100 AND 20 < 30)
        assert bt.df['entry_signal'].all() == True
        assert bt.df['exit_signal'].all() == False
        
        # Force values to fail the first condition
        bt.df['close'] = 90
        bt.generate_signals()
        assert bt.df['entry_signal'].all() == False
        
        # Force values to trigger exit
        bt.df['RSI_14'] = 80
        bt.generate_signals()
        assert bt.df['exit_signal'].all() == True

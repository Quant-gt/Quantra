import pandas as pd
import numpy as np
from agents.intent_parser import StrategySchema, Indicator
from engine.backtester import VectorBacktester

def test_run():
    # Construct a dummy DataFrame to run the test offline
    dates = pd.date_range(start="2023-01-01", periods=250)
    df = pd.DataFrame(index=dates)
    df['open'] = np.random.uniform(100, 110, size=250)
    df['high'] = df['open'] + np.random.uniform(0, 2, size=250)
    df['low'] = df['open'] - np.random.uniform(0, 2, size=250)
    df['close'] = np.random.uniform(100, 110, size=250)
    df['volume'] = np.random.randint(1000, 5000, size=250)

    # Construct a dummy parsed schema similar to what LLM would output
    schema = StrategySchema(
        market="IBM",
        timeframe="1d",
        indicators=[
            Indicator(name="SMA", period=50),
            Indicator(name="RSI", period=14),
            Indicator(name="SUPERTREND", period=10),
            Indicator(name="ADX", period=14),
            Indicator(name="DONCHIAN", period=20),
            Indicator(name="OBV", period=1),
            Indicator(name="PIVOTS", period=1),
            Indicator(name="BOLLINGER", period=20),
            Indicator(name="VWAP", period=1),
            Indicator(name="STOCHASTIC", period=14)
        ],
        entry_logic=["close > SMA_50", "RSI_14 < 30", "ADX_14 > 25", "close > SUPERTREND_10"],
        exit_logic=["RSI_14 > 70"],
        stop_loss_atr=2.5
    )
    
    print(f"Running backtest with parameters: {schema.model_dump()}")
    
    bt = VectorBacktester(strategy=schema, df=df.copy())
    metrics = bt.run_backtest()
    
    print("\nBacktest Results:")
    print(metrics)

    # Verify security validation blocks expression injection
    schema_malicious = StrategySchema(
        market="IBM",
        timeframe="1d",
        indicators=[Indicator(name="SMA", period=50)],
        entry_logic=["close > 50; import os; os.system('echo injection')"],
        exit_logic=["False"],
        stop_loss_atr=2.5
    )
    print("\nVerifying security sanitizer on malicious prompt...")
    bt_malicious = VectorBacktester(strategy=schema_malicious, df=df.copy())
    try:
        bt_malicious.run_backtest()
        print("FAIL: Malicious logic was not blocked!")
        raise RuntimeError("Security sanitization failure")
    except ValueError as e:
        print("SUCCESS: Malicious logic blocked with message:", e)

if __name__ == "__main__":
    test_run()

from agents.intent_parser import StrategySchema, Indicator
from engine.backtester import VectorBacktester

def test_run():
    # Construct a dummy parsed schema similar to what LLM would output
    schema = StrategySchema(
        market="NSE_IDX",
        timeframe="1d",
        indicators=[
            Indicator(name="SMA", period=50),
            Indicator(name="RSI", period=14)
        ],
        entry_logic=["close > SMA_50", "RSI_14 < 30"],
        exit_logic=["RSI_14 > 70"],
        stop_loss_atr=2.5
    )
    
    print(f"Running backtest with parameters: {schema.model_dump()}")
    
    bt = VectorBacktester(strategy=schema, start_date="2020-01-01")
    metrics = bt.run_backtest()
    
    print("\nBacktest Results:")
    print(metrics)

if __name__ == "__main__":
    test_run()

from agents.intent_parser import StrategySchema, Indicator
from engine.optimizer import StrategyOptimizer

def test_optimization():
    # Construct a dummy parsed schema
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
    
    print("Original Parameters:")
    for ind in schema.indicators:
        print(f" - {ind.name}: {ind.period}")
    print(f" - Stop Loss ATR: {schema.stop_loss_atr}")
    
    print("\nStarting Optimization (this may take a few moments)...")
    optimizer = StrategyOptimizer(base_strategy=schema, start_date="2020-01-01")
    # Using 10 trials for quick local test
    results = optimizer.run_optimization(n_trials=10)
    
    print("\nOptimization Complete!")
    print("\nBest Found Parameters:")
    print(results['best_parameters'])
    
    print("\nOptimized Metrics:")
    print(results['optimized_metrics'])

if __name__ == "__main__":
    test_optimization()

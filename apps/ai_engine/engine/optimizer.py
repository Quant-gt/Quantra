import optuna
import copy
from engine.backtester import VectorBacktester
from agents.intent_parser import StrategySchema

# Suppress optuna logging info
optuna.logging.set_verbosity(optuna.logging.WARNING)

class StrategyOptimizer:
    def __init__(self, base_strategy: StrategySchema, start_date: str = "2020-01-01"):
        self.base_strategy = base_strategy
        self.start_date = start_date
        
    def objective(self, trial):
        # 1. Mutate parameters safely using deepcopy
        mutated_strategy = copy.deepcopy(self.base_strategy)
        
        # Optimize each indicator's period
        for ind in mutated_strategy.indicators:
            old_col = f"{ind.name}_{ind.period}"
            # We constrain the search to a realistic window around the LLM's guess to prevent overfitting
            min_period = max(5, ind.period - 10)
            max_period = min(200, ind.period + 20)
            ind.period = trial.suggest_int(f"{ind.name}_period", min_period, max_period)
            new_col = f"{ind.name}_{ind.period}"
            
            # Update logic strings to reference the newly created column
            mutated_strategy.entry_logic = [cond.replace(old_col, new_col) for cond in mutated_strategy.entry_logic]
            if mutated_strategy.exit_logic:
                mutated_strategy.exit_logic = [cond.replace(old_col, new_col) for cond in mutated_strategy.exit_logic]
            
        # Optimize Stop Loss ATR multiplier
        mutated_strategy.stop_loss_atr = trial.suggest_float("stop_loss_atr", 1.5, 4.0, step=0.1)
            
        # 2. Run backtest
        bt = VectorBacktester(mutated_strategy, start_date=self.start_date)
        
        try:
            results = bt.run_backtest()
        except Exception:
            # If a parameter combination breaks the engine, heavily penalize it
            return 0.0
        
        win_rate = results.get('win_rate_pct', 0.0)
        max_dd = results.get('max_drawdown_pct', 0.0)
        total_return = results.get('total_return_pct', 0.0)
        
        # 3. Guardrail: Max Drawdown Penalty (>15%)
        if max_dd > 15.0:
            # We return a negative score or zero if drawdown is too high, to reject this trial
            # Or we can just subtract the excess drawdown from the win rate
            penalty = (max_dd - 15.0) * 2  # 2% win rate penalty for every 1% DD over 15%
            penalized_win_rate = max(0.0, win_rate - penalty)
            return penalized_win_rate
            
        # 4. Target metric: Win Rate
        # We also want to ensure the strategy actually trades and makes money
        if results.get('total_trading_days', 0) < 5 or total_return <= 0:
            return 0.0
            
        return win_rate
        
    def run_optimization(self, n_trials=30) -> dict:
        """Runs the Optuna study and returns the best parameters."""
        study = optuna.create_study(direction="maximize")
        study.optimize(self.objective, n_trials=n_trials)
        
        best_params = study.best_params
        best_win_rate = study.best_value
        
        # Reconstruct the optimal strategy
        optimal_strategy = copy.deepcopy(self.base_strategy)
        for ind in optimal_strategy.indicators:
            param_key = f"{ind.name}_period"
            if param_key in best_params:
                old_col = f"{ind.name}_{ind.period}"
                ind.period = best_params[param_key]
                new_col = f"{ind.name}_{ind.period}"
                optimal_strategy.entry_logic = [cond.replace(old_col, new_col) for cond in optimal_strategy.entry_logic]
                if optimal_strategy.exit_logic:
                    optimal_strategy.exit_logic = [cond.replace(old_col, new_col) for cond in optimal_strategy.exit_logic]
                
        if "stop_loss_atr" in best_params:
            optimal_strategy.stop_loss_atr = best_params["stop_loss_atr"]
            
        # Run one final backtest with best params to get full metrics
        final_bt = VectorBacktester(optimal_strategy, start_date=self.start_date)
        final_metrics = final_bt.run_backtest()
        
        return {
            "best_parameters": best_params,
            "optimized_metrics": final_metrics,
            "original_strategy": self.base_strategy.model_dump(),
            "optimized_strategy": optimal_strategy.model_dump()
        }

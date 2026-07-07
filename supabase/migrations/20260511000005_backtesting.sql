-- Create backtest_results table
CREATE TABLE IF NOT EXISTS backtest_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  date_range JSONB, -- { start: '...', end: '...' }
  metrics JSONB, -- { cagr: ..., sharpe: ..., max_drawdown: ... }
  equity_curve JSONB, -- [ { date: '...', value: ... }, ... ]
  trade_log JSONB, -- [ { entry_time: '...', exit_time: '...', pnl: ... }, ... ]
  parameters JSONB, -- The parameters used for this run
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS backtest_results_strategy_id_idx ON backtest_results(strategy_id);
CREATE INDEX IF NOT EXISTS backtest_results_user_id_idx ON backtest_results(user_id);

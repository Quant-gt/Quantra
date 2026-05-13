-- Materialized view for portfolio performance
-- In a real app with pg_cron: 
-- SELECT cron.schedule('refresh_portfolio_stats', '0 0 * * *', 'REFRESH MATERIALIZED VIEW portfolio_stats');

CREATE MATERIALIZED VIEW IF NOT EXISTS portfolio_stats AS
SELECT 
  user_id,
  SUM(today_pnl) as total_today_pnl,
  SUM(unrealised_pnl) as total_unrealised_pnl,
  COUNT(id) as active_strategies_count
FROM marketplace_subscriptions
WHERE status = 'active'
GROUP BY user_id;

-- Unique index required for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS portfolio_stats_user_id_idx ON portfolio_stats (user_id);

-- Create covering indexes for foreign keys to optimize referential integrity checks and performance
CREATE INDEX IF NOT EXISTS admin_alerts_strategy_id_idx ON public.admin_alerts (strategy_id);
CREATE INDEX IF NOT EXISTS admin_alerts_user_id_idx ON public.admin_alerts (user_id);
CREATE INDEX IF NOT EXISTS compliance_audit_user_id_idx ON public.compliance_audit (user_id);
CREATE INDEX IF NOT EXISTS creator_earnings_strategy_id_idx ON public.creator_earnings (strategy_id);
CREATE INDEX IF NOT EXISTS marketplace_subscriptions_strategy_id_idx ON public.marketplace_subscriptions (strategy_id);
CREATE INDEX IF NOT EXISTS marketplace_subscriptions_user_id_idx ON public.marketplace_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS strategies_creator_id_idx ON public.strategies (creator_id);
CREATE INDEX IF NOT EXISTS user_watchlist_strategy_id_idx ON public.user_watchlist (strategy_id);

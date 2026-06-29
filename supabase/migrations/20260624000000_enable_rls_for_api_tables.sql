-- Migration: enable_rls_for_api_tables
-- Description: Enables Row-Level Security (RLS) and defines secure policies for all exposed API tables.

-- ========================================================
-- 1. COMPLIANCE AUDIT
-- ========================================================
ALTER TABLE public.compliance_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own compliance audit" ON public.compliance_audit;
CREATE POLICY "Users can view own compliance audit" 
ON public.compliance_audit 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- ========================================================
-- 2. ADMIN ALERTS
-- ========================================================
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own admin alerts" ON public.admin_alerts;
CREATE POLICY "Users can view own admin alerts" 
ON public.admin_alerts 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- ========================================================
-- 3. USER WATCHLIST (Singular - from API migrations)
-- ========================================================
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own watchlist" ON public.user_watchlist;
CREATE POLICY "Users can manage own watchlist" 
ON public.user_watchlist 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 4. STRATEGY METRICS
-- ========================================================
ALTER TABLE public.strategy_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view strategy metrics" ON public.strategy_metrics;
CREATE POLICY "Anyone can view strategy metrics" 
ON public.strategy_metrics 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- ========================================================
-- 5. STRATEGY VERSIONS
-- ========================================================
ALTER TABLE public.strategy_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators can view own strategy versions" ON public.strategy_versions;
CREATE POLICY "Creators can view own strategy versions" 
ON public.strategy_versions 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.strategies s
    WHERE s.id = strategy_versions.strategy_id
    AND s.creator_id = auth.uid()
  )
);

-- ========================================================
-- 6. BACKTEST RESULTS
-- ========================================================
ALTER TABLE public.backtest_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own backtest results" ON public.backtest_results;
CREATE POLICY "Users can manage own backtest results" 
ON public.backtest_results 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 7. SCANNER CONFIGS
-- ========================================================
ALTER TABLE public.scanner_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own scanner configs" ON public.scanner_configs;
CREATE POLICY "Users can manage own scanner configs" 
ON public.scanner_configs 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 8. SCAN RESULTS
-- ========================================================
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own scan results" ON public.scan_results;
CREATE POLICY "Users can view own scan results" 
ON public.scan_results 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.scanner_configs c
    WHERE c.id = scan_results.scanner_config_id
    AND c.user_id = auth.uid()
  )
);

-- ========================================================
-- 9. NOTIFICATION PREFERENCES
-- ========================================================
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage own notification preferences" 
ON public.notification_preferences 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 10. CREATOR EARNINGS
-- ========================================================
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators can view own earnings" ON public.creator_earnings;
CREATE POLICY "Creators can view own earnings" 
ON public.creator_earnings 
FOR SELECT 
TO authenticated 
USING (auth.uid() = creator_id);

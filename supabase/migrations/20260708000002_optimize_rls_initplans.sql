-- Optimize RLS policies by wrapping auth.uid() in (SELECT auth.uid()) to prevent row-by-row re-evaluation (InitPlan optimization)

-- 1. COMPLIANCE AUDIT
DROP POLICY IF EXISTS "Users can view own compliance audit" ON public.compliance_audit;
CREATE POLICY "Users can view own compliance audit" 
ON public.compliance_audit 
FOR SELECT 
TO authenticated 
USING (user_id = (select auth.uid()));

-- 2. ADMIN ALERTS
DROP POLICY IF EXISTS "Users can view own admin alerts" ON public.admin_alerts;
CREATE POLICY "Users can view own admin alerts" 
ON public.admin_alerts 
FOR SELECT 
TO authenticated 
USING (user_id = (select auth.uid()));

-- 3. USER WATCHLIST
DROP POLICY IF EXISTS "Users can manage own watchlist" ON public.user_watchlist;
CREATE POLICY "Users can manage own watchlist" 
ON public.user_watchlist 
FOR ALL 
TO authenticated 
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- 5. STRATEGY VERSIONS
DROP POLICY IF EXISTS "Creators can view own strategy versions" ON public.strategy_versions;
CREATE POLICY "Creators can view own strategy versions" 
ON public.strategy_versions 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.strategies s
    WHERE s.id = strategy_versions.strategy_id
    AND s.creator_id = (select auth.uid())
  )
);

-- 6. BACKTEST RESULTS
DROP POLICY IF EXISTS "Users can manage own backtest results" ON public.backtest_results;
CREATE POLICY "Users can manage own backtest results" 
ON public.backtest_results 
FOR ALL 
TO authenticated 
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- 7. SCANNER CONFIGS
DROP POLICY IF EXISTS "Users can manage own scanner configs" ON public.scanner_configs;
CREATE POLICY "Users can manage own scanner configs" 
ON public.scanner_configs 
FOR ALL 
TO authenticated 
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- 8. SCAN RESULTS
DROP POLICY IF EXISTS "Users can view own scan results" ON public.scan_results;
CREATE POLICY "Users can view own scan results" 
ON public.scan_results 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.scanner_configs c
    WHERE c.id = scan_results.scanner_config_id
    AND c.user_id = (select auth.uid())
  )
);

-- 9. NOTIFICATION PREFERENCES
DROP POLICY IF EXISTS "Users can manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage own notification preferences" 
ON public.notification_preferences 
FOR ALL 
TO authenticated 
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- 10. CREATOR EARNINGS
DROP POLICY IF EXISTS "Creators can view own earnings" ON public.creator_earnings;
CREATE POLICY "Creators can view own earnings" 
ON public.creator_earnings 
FOR SELECT 
TO authenticated 
USING (creator_id = (select auth.uid()));

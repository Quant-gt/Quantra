-- Migration: enable_rls_dual_role
-- Description: Enables RLS and creates access policies for brokerage_keys and subscriptions tables.

-- 1. Secure brokerage_keys (Only the owner can view/manage their API credentials)
ALTER TABLE public.brokerage_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own brokerage keys" ON public.brokerage_keys;
CREATE POLICY "Users can manage their own brokerage keys" 
ON public.brokerage_keys 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Secure subscriptions (Only the subscriber can view/manage their subscriptions)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can manage their own subscriptions" 
ON public.subscriptions 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

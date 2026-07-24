-- Migration: rls_broker_subscriptions
-- Description: Creates RLS access policies for broker_connections and marketplace_subscriptions tables.

-- Policies for public.broker_connections
DROP POLICY IF EXISTS "Users can manage their own broker connections" ON public.broker_connections;
CREATE POLICY "Users can manage their own broker connections" 
ON public.broker_connections 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Policies for public.marketplace_subscriptions
DROP POLICY IF EXISTS "Users can view own or created subscriptions" ON public.marketplace_subscriptions;
CREATE POLICY "Users can view own or created subscriptions" 
ON public.marketplace_subscriptions 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() = user_id 
  OR public.is_admin() 
  OR EXISTS (
    SELECT 1 FROM public.strategies s 
    WHERE s.id = marketplace_subscriptions.strategy_id 
    AND s.creator_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.marketplace_subscriptions;
CREATE POLICY "Users can manage own subscriptions" 
ON public.marketplace_subscriptions 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

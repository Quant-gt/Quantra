-- Migration: lockdown_users_strategies_rls
-- Description: Locks down RLS for users, strategies, master_execution_log, and strategy_positions. 
-- Introduces is_admin() checking against ssbiswal14@gmail.com.

-- 1. Create is_admin() utility function (Uses JWT claims to avoid infinite recursion on public.users)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    current_setting('request.jwt.claims', true)::jsonb->>'email' = 'ssbiswal14@gmail.com',
    false
  );
$$;

-- 2. Add is_admin column to users table to make it visible in admin dashboards
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
UPDATE public.users SET is_admin = true WHERE email = 'ssbiswal14@gmail.com';

-- 3. LOCK DOWN PUBLIC.USERS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users 
FOR SELECT USING (id = (SELECT auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users 
FOR UPDATE USING (id = (SELECT auth.uid()) OR public.is_admin()) 
WITH CHECK (id = (SELECT auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
CREATE POLICY "Admin can insert users" ON public.users 
FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
CREATE POLICY "Admin can delete users" ON public.users 
FOR DELETE USING (public.is_admin());

-- 4. LOCK DOWN PUBLIC.STRATEGIES
-- Safely add columns in case the production DB missed earlier migrations
ALTER TABLE public.strategies ADD COLUMN IF NOT EXISTS is_public_marketplace boolean default false;
ALTER TABLE public.strategies ADD COLUMN IF NOT EXISTS monthly_fee numeric(10, 2) default 0.00;
ALTER TABLE public.strategies ADD COLUMN IF NOT EXISTS logic_graph jsonb not null default '{}'::jsonb;

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public strategies" ON public.strategies;
CREATE POLICY "Anyone can view public strategies" ON public.strategies 
FOR SELECT TO anon, authenticated USING (is_public_marketplace = true OR public.is_admin());

DROP POLICY IF EXISTS "Creators can manage own strategies" ON public.strategies;
CREATE POLICY "Creators can manage own strategies" ON public.strategies 
FOR ALL TO authenticated USING (creator_id = (SELECT auth.uid()) OR public.is_admin()) 
WITH CHECK (creator_id = (SELECT auth.uid()) OR public.is_admin());

-- 5. SECURE PUBLIC.MASTER_EXECUTION_LOG (Was previously USING (true))
-- Ensure table exists in case of missing earlier migrations
CREATE TABLE IF NOT EXISTS public.master_execution_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    fyers_order_id text,
    symbol text NOT NULL,
    order_type text CHECK (order_type IN ('BUY', 'SELL')) NOT NULL,
    quantity integer NOT NULL,
    price numeric(10, 2),
    status text DEFAULT 'PENDING',
    executed_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    strategy_allocations jsonb
);

ALTER TABLE public.master_execution_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read execution logs" ON public.master_execution_log;
CREATE POLICY "Admin can view master execution logs" ON public.master_execution_log 
FOR SELECT TO authenticated USING (public.is_admin());

-- 6. SECURE PUBLIC.STRATEGY_POSITIONS (Was previously USING (true))
-- Ensure table exists in case of missing earlier migrations
CREATE TABLE IF NOT EXISTS public.strategy_positions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id uuid REFERENCES public.strategies ON DELETE CASCADE,
    symbol text NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    average_price numeric(10, 2) NOT NULL DEFAULT 0.00,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(strategy_id, symbol)
);

ALTER TABLE public.strategy_positions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read strategy positions" ON public.strategy_positions;
CREATE POLICY "Creators and Admin can view strategy positions" ON public.strategy_positions 
FOR SELECT TO authenticated USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.strategies s 
    WHERE s.id = strategy_positions.strategy_id 
    AND s.creator_id = (SELECT auth.uid())
  )
);

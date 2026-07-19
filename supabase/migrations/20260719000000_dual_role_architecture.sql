-- 20260719000000_dual_role_architecture.sql

-- 1. Create Enums safely
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'creator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE strategy_status AS ENUM ('draft', 'backtesting', 'public', 'delisted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Alter existing Users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS roles user_role[] DEFAULT '{user}',
  ADD COLUMN IF NOT EXISTS current_view user_role DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50),
  ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(50);

-- Migrate old `is_creator` flag if it exists, to the `roles` array (ensure backward compatibility)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_creator') THEN
        UPDATE public.users 
        SET roles = '{user,creator}'
        WHERE is_creator = true AND not ('creator' = ANY(roles));
    END IF;
END $$;

-- 3. Brokerage Integrations Table
CREATE TABLE IF NOT EXISTS public.brokerage_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    broker_name VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    api_secret_encrypted TEXT NOT NULL,
    is_sandbox_only BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Strategies Table (Listings/Marketplace/Storefront)
CREATE TABLE IF NOT EXISTS public.strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    code_repository_url TEXT,
    status strategy_status DEFAULT 'draft',
    price_monthly NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

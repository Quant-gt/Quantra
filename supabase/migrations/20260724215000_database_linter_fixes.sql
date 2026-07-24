-- Migration: database_linter_fixes
-- Description: Fixes security advisories from the database linter.

-- 1. Move vector extension to the extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION vector SET SCHEMA extensions;

-- 2. Fix mutable search paths on functions
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.search_magic_strategies(extensions.vector, double precision, integer, text) SET search_path = public;

-- 3. Restrict select access to the portfolio_stats materialized view
REVOKE SELECT ON public.portfolio_stats FROM anon;
REVOKE SELECT ON public.portfolio_stats FROM authenticated;

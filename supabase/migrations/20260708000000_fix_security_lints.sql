-- 1. Extension in Public: Move vector to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION vector SET SCHEMA extensions;

-- 2. Update search_magic_strategies to use extensions.vector instead of public.vector
CREATE OR REPLACE FUNCTION public.search_magic_strategies(
  query_embedding extensions.vector(384),
  match_threshold float,
  match_count int,
  fulltext_query text DEFAULT NULL
) RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  algo_id text,
  classification text,
  min_capital numeric,
  fee numeric,
  cagr numeric,
  max_drawdown numeric,
  subscriber_count int,
  similarity float,
  final_score float
) LANGUAGE plpgsql 
SET search_path = '' 
AS $$
BEGIN
  RETURN QUERY
  WITH semantic_matches AS (
    SELECT 
      s.id,
      1 - (s.embedding <=> query_embedding) as similarity
    FROM public.strategies s
    WHERE 1 - (s.embedding <=> query_embedding) > match_threshold
      AND s.status = 'live'
  ),
  fulltext_matches AS (
    SELECT 
      s.id,
      ts_rank(s.search_vector, to_tsquery('english', fulltext_query)) as similarity
    FROM public.strategies s
    WHERE s.search_vector @@ to_tsquery('english', fulltext_query)
      AND s.status = 'live'
  ),
  combined_matches AS (
    SELECT semantic_matches.id, semantic_matches.similarity FROM semantic_matches
    UNION
    SELECT fulltext_matches.id, fulltext_matches.similarity FROM fulltext_matches
  )
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.algo_id,
    s.type as classification,
    s.min_capital,
    s.fee,
    COALESCE(m.cagr, 0) as cagr,
    COALESCE(m.max_drawdown, 0) as max_drawdown,
    COALESCE(m.subscriber_count, 0) as subscriber_count,
    cm.similarity,
    (
      (cm.similarity * 0.5) + 
      ((COALESCE(m.cagr, 0) / 100.0) * 0.3) + 
      ((LEAST(COALESCE(m.subscriber_count, 0), 1000) / 1000.0) * 0.2)
    ) as final_score
  FROM combined_matches cm
  JOIN public.strategies s ON cm.id = s.id
  LEFT JOIN public.strategy_metrics m ON s.id = m.strategy_id
  ORDER BY final_score DESC
  LIMIT match_count;
END;
$$;

-- 3. Materialized View in API: Revoke API access to portfolio_stats
REVOKE ALL ON public.portfolio_stats FROM anon, authenticated;

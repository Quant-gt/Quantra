-- Add embedding column to strategies
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Create IVFFlat index for similarity search
CREATE INDEX IF NOT EXISTS strategies_embedding_idx ON strategies USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);

-- Also prepare fulltext search tsvector column
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A')
) STORED;

CREATE INDEX IF NOT EXISTS strategies_search_idx ON strategies USING GIN (search_vector);

-- RPC function for hybrid magic search
-- Combines: 50% semantic similarity + 30% cagr + 20% popularity
CREATE OR REPLACE FUNCTION public.search_magic_strategies(
  query_embedding public.vector(384),
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
    SELECT id, similarity FROM semantic_matches
    UNION
    SELECT id, similarity FROM fulltext_matches
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

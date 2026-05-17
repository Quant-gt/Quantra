import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Initialize Redis for caching
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const normalizedQuery = query.trim().toLowerCase();
    const queryHash = crypto.createHash('md5').update(normalizedQuery).digest('hex');
    const cacheKey = `magic_search:${queryHash}`;

    // 1. Check Cache
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const cachedResults = await redis.get(cacheKey);
      if (cachedResults) {
        return NextResponse.json({ results: cachedResults, cached: true });
      }
    }

    // 2. Call NLP Service (Simulated or Local)
    // In production, this would be the Render.com URL
    const nlpUrl = process.env.NLP_SERVICE_URL || 'http://localhost:3002'; 
    let nlpData;

    try {
      const nlpResponse = await fetch(`${nlpUrl}/api/parse_query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });

      if (!nlpResponse.ok) throw new Error('NLP service failed');
      nlpData = await nlpResponse.json();
    } catch (e) {
      console.warn('NLP Service unavailable, falling back to simulated extraction');
      // Fallback simulation if NLP service is not running
      nlpData = {
        embedding: Array(384).fill(0).map(() => Math.random() - 0.5), // Dummy embedding
        entities: [
          { type: 'RISK_LEVEL', value: 'Medium' }
        ],
        tsvector_fallback: query.replace(' ', ' | ')
      };
    }

    // 3. Query Supabase using RPC
    const supabase = await createClient();
    const { data: results, error } = await supabase.rpc('search_magic_strategies', {
      query_embedding: nlpData.embedding,
      match_threshold: 0.3,
      match_count: 10,
      fulltext_query: nlpData.tsvector_fallback
    });

    if (error) throw error;

    // 4. Attach extracted entities for badge rendering
    const enhancedResults = results?.map((item: any) => ({
      ...item,
      matched_entities: nlpData.entities
    })) || [];

    // 5. Cache Results
    if (process.env.UPSTASH_REDIS_REST_URL && enhancedResults.length > 0) {
      await redis.set(cacheKey, enhancedResults, { ex: 300 }); // 5 min TTL
    }

    return NextResponse.json({ results: enhancedResults, cached: false });

  } catch (error: any) {
    console.error('Magic Search Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

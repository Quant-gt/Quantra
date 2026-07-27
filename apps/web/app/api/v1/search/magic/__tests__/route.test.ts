import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

// Mock supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  })),
}));

// Mock upstash redis
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
  })),
}));

describe('Magic Search Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 503 when NLP service fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused')) as any;

    const req = new Request('http://localhost/api/v1/search/magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test query' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('NLP Service is currently unavailable. Please try again later.');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('returns 503 when NLP service returns non-ok status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any;

    const req = new Request('http://localhost/api/v1/search/magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test query' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('NLP Service is currently unavailable. Please try again later.');
    expect(global.fetch).toHaveBeenCalled();
  });
});

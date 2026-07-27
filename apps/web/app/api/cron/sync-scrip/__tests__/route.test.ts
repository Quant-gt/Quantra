import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';

// Mock supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

describe('Cron Sync Scrip Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('rejects unauthenticated requests when CRON_SECRET is set', async () => {
    process.env.CRON_SECRET = 'my-secret';
    const req = new Request('http://localhost/api/cron/sync-scrip', {
      headers: {
        authorization: 'Bearer wrong-secret',
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    expect(await res.text()).toBe('Unauthorized');
  });

  it('allows unauthenticated requests when CRON_SECRET is not set', async () => {
    delete process.env.CRON_SECRET;
    const req = new Request('http://localhost/api/cron/sync-scrip');

    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('processes scrip sync successfully with correct auth', async () => {
    process.env.CRON_SECRET = 'my-secret';
    const req = new Request('http://localhost/api/cron/sync-scrip', {
      headers: {
        authorization: 'Bearer my-secret',
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.synced_records).toBeGreaterThan(0);
    expect(data.fetches).toHaveLength(4); // 4 brokers
  });
});

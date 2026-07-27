import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';

describe('Market Ticker Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any;

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.stocks).toEqual([]);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('returns empty array on network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error')) as any;

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.stocks).toEqual([]);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('formats stocks correctly on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        quoteResponse: {
          result: [
            { symbol: '^NSEI', regularMarketPrice: 20000, regularMarketChangePercent: 1.5 },
            { symbol: 'RELIANCE.NS', regularMarketPrice: 2500, regularMarketChangePercent: -0.5 },
          ]
        }
      })
    }) as any;

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.stocks).toHaveLength(2);
    expect(data.stocks[0].name).toBe('NIFTY 50');
    expect(data.stocks[0].up).toBe(true);
    expect(data.stocks[0].change).toBe('+1.50%');
    
    expect(data.stocks[1].name).toBe('RELIANCE');
    expect(data.stocks[1].up).toBe(false);
    expect(data.stocks[1].change).toBe('-0.50%');
  });
});

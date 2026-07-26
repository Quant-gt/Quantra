import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware, config } from '../middleware';
import * as ssr from '@supabase/ssr';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

describe('Middleware', () => {
  const createMockRequest = (pathname: string, searchParams = new URLSearchParams()) => {
    const url = new URL(`http://localhost${pathname}?${searchParams.toString()}`);
    return {
      nextUrl: {
        pathname,
        searchParams,
      },
      url: url.toString(),
      headers: new Headers(),
      cookies: {
        get: vi.fn(),
        set: vi.fn(),
      },
    } as unknown as NextRequest;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects root with code to auth/callback', async () => {
    const req = createMockRequest('/', new URLSearchParams({ code: 'test-code' }));
    const response = await middleware(req);
    expect(response.headers.get('location')).toBe('http://localhost/auth/callback?code=test-code&next=/dashboard');
  });

  it('redirects to auth when accessing dashboard without session', async () => {
    vi.mocked(ssr.createServerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any);

    const req = createMockRequest('/dashboard');
    const response = await middleware(req);
    expect(response.headers.get('location')).toBe('http://localhost/auth');
  });

  it('allows access to dashboard with session', async () => {
    vi.mocked(ssr.createServerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: 'test' } } }),
      },
    } as any);

    const req = createMockRequest('/dashboard');
    const response = await middleware(req);
    // Should not redirect
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects to /dashboard/marketplace when accessing /marketplace', async () => {
    vi.mocked(ssr.createServerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any);

    const req = createMockRequest('/marketplace');
    const response = await middleware(req);
    expect(response.headers.get('location')).toBe('http://localhost/dashboard/marketplace');
  });

  it('redirects logged in users away from /auth to /dashboard', async () => {
    vi.mocked(ssr.createServerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: 'test' } } }),
      },
    } as any);

    const req = createMockRequest('/auth');
    const response = await middleware(req);
    expect(response.headers.get('location')).toBe('http://localhost/dashboard');
  });

  it('allows logged in users to access /auth/callback', async () => {
    vi.mocked(ssr.createServerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: 'test' } } }),
      },
    } as any);

    const req = createMockRequest('/auth/callback');
    const response = await middleware(req);
    expect(response.headers.get('location')).toBeNull();
  });

  it('config matcher should be defined', () => {
    expect(config.matcher).toBeDefined();
    expect(config.matcher.length).toBeGreaterThan(0);
  });
});

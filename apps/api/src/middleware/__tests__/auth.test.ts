import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';

const { mockGetUser, mockSingle } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: mockSingle,
  }),
}));

import { adminOnly, dailyAuthCheck } from '../auth';

describe('dailyAuthCheck middleware', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let nextFunction: express.NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };

    const jsonMock = vi.fn().mockImplementation((body) => mockResponse);
    const statusMock = vi.fn().mockImplementation((code) => ({
      json: jsonMock,
    }));

    mockResponse = {
      status: statusMock,
    } as any;

    nextFunction = vi.fn();
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return 401 if authorization header is missing', async () => {
    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or user is not found', async () => {
    mockRequest.headers!.authorization = 'Bearer invalid-token';
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('User not found') });

    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if current time is past 16:05 IST', async () => {
    mockRequest.headers!.authorization = 'Bearer valid-token';
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });

    // Set system time to 16:10 IST (10:40 UTC)
    const mockDate = new Date(Date.UTC(2026, 6, 24, 10, 40, 0)); 
    vi.setSystemTime(mockDate);

    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ code: 'SESSION_EXPIRED_TIME' }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if subscription is missing or inactive', async () => {
    mockRequest.headers!.authorization = 'Bearer valid-token';
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });

    // 10:00 IST (04:30 UTC)
    const mockDate = new Date(Date.UTC(2026, 6, 24, 4, 30, 0));
    vi.setSystemTime(mockDate);

    mockSingle.mockResolvedValue({ data: null, error: new Error('Subscription not found') });

    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ code: 'NO_ACTIVE_SESSION' }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if 2FA authentication is required for today', async () => {
    mockRequest.headers!.authorization = 'Bearer valid-token';
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });

    // Now: 2026-07-24 10:00 IST
    const mockDate = new Date(Date.UTC(2026, 6, 24, 4, 30, 0));
    vi.setSystemTime(mockDate);

    // Last 2FA: 2026-07-23 (yesterday)
    mockSingle.mockResolvedValue({
      data: {
        status: 'active',
        last_daily_2fa_at: new Date(Date.UTC(2026, 6, 23, 4, 30, 0)).toISOString(),
        session_valid_until: new Date(Date.UTC(2026, 6, 24, 12, 0, 0)).toISOString(),
      },
      error: null,
    });

    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ code: 'MANDATORY_DAILY_2FA' }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if session validity period has expired', async () => {
    mockRequest.headers!.authorization = 'Bearer valid-token';
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });

    // Now: 2026-07-24 10:00 IST
    const mockDate = new Date(Date.UTC(2026, 6, 24, 4, 30, 0));
    vi.setSystemTime(mockDate);

    // Valid until: 2026-07-24 09:00 IST (past)
    mockSingle.mockResolvedValue({
      data: {
        status: 'active',
        last_daily_2fa_at: new Date(Date.UTC(2026, 6, 24, 3, 0, 0)).toISOString(),
        session_valid_until: new Date(Date.UTC(2026, 6, 24, 3, 30, 0)).toISOString(),
      },
      error: null,
    });

    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ code: 'SESSION_EXPIRED_VALIDITY' }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if daily auth check passes', async () => {
    mockRequest.headers!.authorization = 'Bearer valid-token';
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });

    // Now: 2026-07-24 10:00 IST
    const mockDate = new Date(Date.UTC(2026, 6, 24, 4, 30, 0));
    vi.setSystemTime(mockDate);

    // Valid until: 2026-07-24 12:00 IST
    mockSingle.mockResolvedValue({
      data: {
        status: 'active',
        last_daily_2fa_at: new Date(Date.UTC(2026, 6, 24, 3, 0, 0)).toISOString(),
        session_valid_until: new Date(Date.UTC(2026, 6, 24, 6, 30, 0)).toISOString(),
      },
      error: null,
    });

    await dailyAuthCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});

describe('adminOnly middleware', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let nextFunction: express.NextFunction;
  const originalEnv = process.env.ADMIN_USER_IDS;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    
    const jsonMock = vi.fn().mockImplementation((body) => mockResponse);
    const statusMock = vi.fn().mockImplementation((code) => ({
      json: jsonMock,
    }));
    
    mockResponse = {
      status: statusMock,
    } as any;

    nextFunction = vi.fn();
  });

  afterEach(() => {
    process.env.ADMIN_USER_IDS = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return 401 if x-user-id header is missing', async () => {
    await adminOnly(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith({ error: 'Unauthorized. User ID missing.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if x-user-id is present but user is not an admin', async () => {
    process.env.ADMIN_USER_IDS = 'admin1, admin2';
    mockRequest.headers!['x-user-id'] = 'user3';

    await adminOnly(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith({ error: 'Forbidden. Admin privileges required.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if user is an admin', async () => {
    process.env.ADMIN_USER_IDS = 'admin1, admin2';
    mockRequest.headers!['x-user-id'] = 'admin1';

    await adminOnly(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});

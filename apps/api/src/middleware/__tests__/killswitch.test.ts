import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { killSwitchCheck } from '../killswitch';
import express from 'express';
import redis from '../../lib/redis.js';

vi.mock('../../lib/redis.js', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('killSwitchCheck middleware', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let nextFunction: express.NextFunction;
  const originalRedisUrl = process.env.UPSTASH_REDIS_REST_URL;

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
    
    // Default env setup
    process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:8079';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = originalRedisUrl;
  });

  it('should skip check and call next() if Redis URL is not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    
    await killSwitchCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(redis.get).not.toHaveBeenCalled();
  });

  it('should return 503 if Global Kill Switch is activated', async () => {
    vi.mocked(redis.get).mockResolvedValue('true');

    await killSwitchCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(redis.get).toHaveBeenCalledWith('killswitch:global');
    expect(mockResponse.status).toHaveBeenCalledWith(503);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Global Kill Switch activated. All trading is temporarily suspended.',
      code: 'GLOBAL_KILL_SWITCH',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if User-specific Kill Switch is activated', async () => {
    mockRequest.headers!['x-user-id'] = 'user_123';
    
    // First call (global check) returns null/false, second call (user check) returns 'true'
    vi.mocked(redis.get).mockImplementation(async (key: string) => {
      if (key === 'killswitch:global') return null;
      if (key === 'killswitch:user:user_123') return 'true';
      return null;
    });

    await killSwitchCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(redis.get).toHaveBeenCalledWith('killswitch:global');
    expect(redis.get).toHaveBeenCalledWith('killswitch:user:user_123');
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Your trading access has been suspended via Kill Switch.',
      code: 'USER_KILL_SWITCH',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if neither kill switch is activated', async () => {
    mockRequest.headers!['x-user-id'] = 'user_123';
    vi.mocked(redis.get).mockResolvedValue(null);

    await killSwitchCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(redis.get).toHaveBeenCalledWith('killswitch:global');
    expect(redis.get).toHaveBeenCalledWith('killswitch:user:user_123');
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should fall back gracefully and call next() on Redis errors', async () => {
    vi.mocked(redis.get).mockRejectedValue(new Error('Redis is down'));

    await killSwitchCheck(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});

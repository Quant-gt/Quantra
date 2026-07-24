import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { opsMonitor } from '../ops';
import express from 'express';
import redis from '../../lib/redis.js';

vi.mock('../../lib/redis.js', () => {
  return {
    default: {
      incr: vi.fn(),
      expire: vi.fn(),
    },
  };
});

describe('opsMonitor middleware', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let nextFunction: express.NextFunction;
  const originalRedisUrl = process.env.UPSTASH_REDIS_REST_URL;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      body: {},
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

  it('should return 401 if x-user-id is missing', async () => {
    await opsMonitor(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith({ error: 'Missing x-user-id header for OPS check' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should skip check and call next() if Redis URL is not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    mockRequest.headers!['x-user-id'] = 'user1';

    await opsMonitor(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(redis.incr).not.toHaveBeenCalled();
  });

  it('should set TTL to 2 seconds if request is the first one in the current second (incr returns 1)', async () => {
    mockRequest.headers!['x-user-id'] = 'user1';
    vi.mocked(redis.incr).mockResolvedValue(1);

    await opsMonitor(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(redis.incr).toHaveBeenCalled();
    expect(redis.expire).toHaveBeenCalledWith(expect.any(String), 2);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 429 if current OPS count exceeds 10', async () => {
    mockRequest.headers!['x-user-id'] = 'user1';
    vi.mocked(redis.incr).mockResolvedValue(11);

    await opsMonitor(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(429);
    const responseJson = (mockResponse.status as any)().json;
    expect(responseJson).toHaveBeenCalledWith({
      error: 'SEBI 10 Orders Per Second limit exceeded on NSE. Throttled.',
      code: 'OPS_LIMIT_EXCEEDED',
      current_ops: 11,
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should allow request and call next() if OPS count is 10 or less', async () => {
    mockRequest.headers!['x-user-id'] = 'user1';
    vi.mocked(redis.incr).mockResolvedValue(5);

    await opsMonitor(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should fall back gracefully and call next() on Redis errors', async () => {
    mockRequest.headers!['x-user-id'] = 'user1';
    vi.mocked(redis.incr).mockRejectedValue(new Error('Redis connection failed'));

    await opsMonitor(mockRequest as express.Request, mockResponse as express.Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});

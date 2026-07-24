import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn(),
    },
  }),
}));

import { adminOnly } from '../auth';
import express from 'express';

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

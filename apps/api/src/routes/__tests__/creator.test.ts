import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import creatorRouter from '../creator';

// Mock Supabase client
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockUpdate = vi.fn();
const mockUpsert = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: mockSelect,
      update: mockUpdate,
      upsert: mockUpsert,
    })),
  })),
}));

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api/v1/creator', creatorRouter);

describe('Creator Onboarding Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default chain for select
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
  });

  it('returns 401 if x-user-id header is missing', async () => {
    const res = await request(app).post('/api/v1/creator/onboard').send({});
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized. User ID missing.');
  });

  it('returns 400 if user is already approved', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { kyc_status: 'approved' } });
    
    const res = await request(app)
      .post('/api/v1/creator/onboard')
      .set('x-user-id', 'user123')
      .send({});
      
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Your KYC is already approved and verified.');
  });

  it('returns 400 if PAN is missing or invalid', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    
    const res = await request(app)
      .post('/api/v1/creator/onboard')
      .set('x-user-id', 'user123')
      .send({ pan_number: '123' }); // Invalid PAN length
      
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('A valid 10-character PAN Number is required for SEBI compliance.');
  });

  it('returns 400 if RIA but missing SEBI registration number', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    
    const res = await request(app)
      .post('/api/v1/creator/onboard')
      .set('x-user-id', 'user123')
      .send({ pan_number: 'ABCDE1234F', is_ria: true });
      
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('SEBI Registration Number is required if you are registering as an RIA.');
  });

  it('returns 409 if PAN is already registered', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { code: '23505' } }) });
    
    const res = await request(app)
      .post('/api/v1/creator/onboard')
      .set('x-user-id', 'user123')
      .send({ pan_number: 'ABCDE1234F' });
      
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('This PAN Number is already registered to another account.');
  });

  it('successfully onboards creator', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    mockUpsert.mockResolvedValue({ error: null });
    
    const res = await request(app)
      .post('/api/v1/creator/onboard')
      .set('x-user-id', 'user123')
      .send({ pan_number: 'ABCDE1234F', is_ria: true, sebi_registration_number: 'INA123456789' });
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Creator profile successfully initialized. KYC is pending verification.');
    
    // Check that upsert was called with correct params
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user123',
        sebi_registration_number: 'INA123456789',
        is_ria: true,
        kyc_status: 'pending'
      }),
      expect.any(Object)
    );
  });
});

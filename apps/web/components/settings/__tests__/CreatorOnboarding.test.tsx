import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreatorOnboarding from '../CreatorOnboarding';

const mockGetSession = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession,
    },
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe('CreatorOnboarding Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGetSession.mockReturnValue(new Promise(() => {})); // Never resolves for initial render check
    render(<CreatorOnboarding />);
    expect(screen.getByText('Loading Creator profile...')).toBeInTheDocument();
  });

  it('renders application pending state', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { user_metadata: { kyc_status: 'pending' } } } },
    });
    
    render(<CreatorOnboarding />);
    
    expect(await screen.findByText('Application Pending')).toBeInTheDocument();
  });

  it('renders approved state', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { user_metadata: { kyc_status: 'approved' } } } },
    });
    
    render(<CreatorOnboarding />);
    
    expect(await screen.findByText('Verified Creator')).toBeInTheDocument();
  });

  it('renders onboarding form when idle', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { user_metadata: { kyc_status: 'none' } } } },
    });
    
    render(<CreatorOnboarding />);
    
    expect(await screen.findByText('Become a Creator')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByPlaceholderText('ABCDE1234F')).toBeInTheDocument();
    expect(screen.getByText(/Are you a SEBI Registered Investment Advisor/i)).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'token', user: { id: 'user123', user_metadata: {} } } },
    });
    
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as any);

    render(<CreatorOnboarding />);
    
    expect(await screen.findByText('Become a Creator')).toBeInTheDocument();
    
    const panInput = screen.getByPlaceholderText('ABCDE1234F');
    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });
    
    fireEvent.change(panInput, { target: { value: 'ABCDE1234F' } });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/creator/onboard', expect.objectContaining({
        method: 'POST',
      }));
      expect(screen.getByText('Application Pending')).toBeInTheDocument();
    });
  });
});

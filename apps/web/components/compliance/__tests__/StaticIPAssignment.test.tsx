import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StaticIPAssignment from '../StaticIPAssignment';

// Mock Supabase client
const mockGetUser = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockUpdate = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser
    },
    from: vi.fn(() => ({
      select: mockSelect,
      update: mockUpdate
    }))
  })
}));

describe('StaticIPAssignment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock chain for select
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
    
    // Setup default mock chain for update
    mockUpdate.mockReturnValue({ eq: mockEq });
    
    // Setup window alert
    window.alert = vi.fn();
    
    // Setup clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve())
      }
    });
  });

  it('renders loading state initially', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockSingle.mockResolvedValue({ data: null });
    
    render(<StaticIPAssignment />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays static IP for unverified user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockSingle.mockResolvedValue({ 
      data: { static_ip_v4: '192.168.1.50', static_ip_verified_at: null } 
    });
    
    render(<StaticIPAssignment />);
    
    await waitFor(() => {
      expect(screen.getByText('192.168.1.50')).toBeInTheDocument();
    });
    
    // Should show the Verify button
    expect(screen.getByRole('button', { name: /Verify Broker IP Handshake/i })).toBeInTheDocument();
  });

  it('displays active state for verified user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockSingle.mockResolvedValue({ 
      data: { static_ip_v4: '192.168.1.50', static_ip_verified_at: '2026-07-25T10:00:00Z' } 
    });
    
    render(<StaticIPAssignment />);
    
    await waitFor(() => {
      expect(screen.getByText(/Static IP successfully verified/i)).toBeInTheDocument();
    });
  });

  it('copies IP to clipboard when Copy is clicked', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockSingle.mockResolvedValue({ 
      data: { static_ip_v4: '192.168.1.50', static_ip_verified_at: null } 
    });
    
    render(<StaticIPAssignment />);
    
    await waitFor(() => {
      expect(screen.getByText('192.168.1.50')).toBeInTheDocument();
    });
    
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('192.168.1.50');
    expect(window.alert).toHaveBeenCalledWith('IP Copied!');
  });
});

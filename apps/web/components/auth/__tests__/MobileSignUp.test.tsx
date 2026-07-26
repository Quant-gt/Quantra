import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MobileSignUp from '../MobileSignUp';

const mockSignInWithOtp = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  })),
}));

vi.mock('../OTPVerification', () => ({
  default: ({ phone }: { phone: string }) => <div data-testid="otp-verification">OTP Sent to {phone}</div>,
}));

describe('MobileSignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<MobileSignUp mode="signup" />);
    expect(screen.getByText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('9876543210')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send OTP/i })).toBeInTheDocument();
  });

  it('shows error for invalid mobile number format', () => {
    render(<MobileSignUp mode="signup" />);
    const input = screen.getByPlaceholderText('9876543210');
    const button = screen.getByRole('button', { name: /Send OTP/i });
    
    // Test too short
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(button);
    expect(screen.getByText('Please enter a valid 10-digit Indian mobile number')).toBeInTheDocument();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
    
    // Test invalid starting digit (Indian numbers usually start with 6-9)
    fireEvent.change(input, { target: { value: '1234567890' } });
    fireEvent.click(button);
    expect(screen.getByText('Please enter a valid 10-digit Indian mobile number')).toBeInTheDocument();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it('submits successfully and shows OTP verification', async () => {
    mockSignInWithOtp.mockResolvedValueOnce({ error: null });
    
    render(<MobileSignUp mode="signup" />);
    const input = screen.getByPlaceholderText('9876543210');
    const button = screen.getByRole('button', { name: /Send OTP/i });
    
    fireEvent.change(input, { target: { value: '9876543210' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalledWith({ phone: '+919876543210' });
      expect(screen.getByTestId('otp-verification')).toBeInTheDocument();
      expect(screen.getByText('OTP Sent to +919876543210')).toBeInTheDocument();
    });
  });

  it('displays error on auth failure', async () => {
    mockSignInWithOtp.mockResolvedValueOnce({ error: new Error('Rate limit exceeded') });
    
    render(<MobileSignUp mode="signup" />);
    const input = screen.getByPlaceholderText('9876543210');
    const button = screen.getByRole('button', { name: /Send OTP/i });
    
    fireEvent.change(input, { target: { value: '9876543210' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OTPVerification from '../OTPVerification';

const mockVerifyOtp = vi.fn();
const mockResend = vi.fn();
const mockPush = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      verifyOtp: mockVerifyOtp,
      resend: mockResend,
    },
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('OTPVerification Component', () => {
  it('renders correctly with email', () => {
    render(<OTPVerification email="test@example.com" />);
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
    // Button is disabled initially
    expect(screen.getByRole('button', { name: /Verify & Continue/i })).toBeDisabled();
  });

  it('handles input and auto-focus', () => {
    render(<OTPVerification email="test@example.com" />);
    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: '1' } });
    // JSDOM doesn't automatically fire focus, but we can check the value updated
    expect(inputs[0]).toHaveValue('1');
  });

  it('submits successfully when 6 digits are entered', async () => {
    mockVerifyOtp.mockResolvedValueOnce({ data: {}, error: null });
    
    render(<OTPVerification email="test@example.com" />);
    const inputs = screen.getAllByRole('textbox');
    const button = screen.getByRole('button', { name: /Verify & Continue/i });
    
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i) } });
    });
    
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockVerifyOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: '012345',
        type: 'email',
      });
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
    });
  });

  it('displays error on verification failure', async () => {
    mockVerifyOtp.mockResolvedValueOnce({ error: new Error('Invalid OTP') });
    
    render(<OTPVerification email="test@example.com" />);
    const inputs = screen.getAllByRole('textbox');
    
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: '1' } });
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Verify & Continue/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPassword from '../ForgotPassword';

const mockResetPasswordForEmail = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  })),
}));

describe('ForgotPassword Component', () => {
  it('renders correctly initially', () => {
    render(<ForgotPassword />);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });

  it('handles successful password reset request', async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });
    
    render(<ForgotPassword />);
    
    const input = screen.getByPlaceholderText('Email Address');
    const button = screen.getByRole('button', { name: /Send Reset Link/i });
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.stringContaining('/auth/update-password'),
      });
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });
  });

  it('displays error on failed request', async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: new Error('Rate limit exceeded') });
    
    render(<ForgotPassword />);
    
    const input = screen.getByPlaceholderText('Email Address');
    const button = screen.getByRole('button', { name: /Send Reset Link/i });
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
      expect(screen.queryByText('Check Your Email')).not.toBeInTheDocument();
    });
  });
});

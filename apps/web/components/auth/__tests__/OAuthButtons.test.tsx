import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OAuthButtons from '../OAuthButtons';

// Mock Supabase client
const mockSignInWithOAuth = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth
    }
  })
}));

describe('OAuthButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window location
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true
    });
  });

  it('renders Google and Apple buttons', () => {
    render(<OAuthButtons />);
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('calls Supabase auth with google provider when Google button is clicked', async () => {
    render(<OAuthButtons />);
    const googleButton = screen.getByText('Google').closest('button');
    
    fireEvent.click(googleButton!);
    
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    });
  });

  it('calls Supabase auth with apple provider when Apple button is clicked', async () => {
    render(<OAuthButtons />);
    const appleButton = screen.getByText('Apple').closest('button');
    
    fireEvent.click(appleButton!);
    
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'apple',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    });
  });
});

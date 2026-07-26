import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PublicNavbar from '../PublicNavbar';

vi.mock('next/link', () => {
  const React = require('react');
  return {
    default: ({ children, href, className }: any) => 
      React.createElement('a', { href, className }, children),
  };
});

describe('PublicNavbar Component', () => {
  it('renders correctly', () => {
    render(<PublicNavbar />);
    expect(screen.getByText('SigmaSpire')).toBeInTheDocument();
    
    // Check for logo home link
    const homeLink = screen.getByText('SigmaSpire').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

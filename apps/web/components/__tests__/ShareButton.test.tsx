import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ShareButton from '../ShareButton';

describe('ShareButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
    // Setup window location
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:3000/blog/test-article' },
      writable: true
    });
    
    // Setup navigator clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve())
      },
      share: undefined
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ShareButton title="Test Article" />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('uses navigator.share if available', async () => {
    navigator.share = vi.fn().mockImplementation(() => Promise.resolve());
    
    render(<ShareButton title="Test Article" />);
    fireEvent.click(screen.getByRole('button'));
    
    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Test Article | SigmaSpire Blog',
      url: 'http://localhost:3000/blog/test-article'
    });
    // Clipboard should not be used if share is available
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('falls back to clipboard if navigator.share is not available', async () => {
    // navigator.share is undefined from beforeEach
    render(<ShareButton title="Test Article" />);
    
    await React.act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/blog/test-article');
    
    // UI should update to "Copied Link" synchronously after the promise resolves
    expect(screen.getByText('Copied Link')).toBeInTheDocument();
    
    // After 2 seconds, it should revert back to "Share"
    await React.act(async () => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText('Share')).toBeInTheDocument();
  });
});

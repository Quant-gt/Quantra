import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TradingViewTicker from '../TradingViewTicker';

describe('TradingViewTicker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<TradingViewTicker />);
    expect(container.querySelector('.tradingview-widget-container')).toBeInTheDocument();
  });

  it('appends the TradingView script', () => {
    const { container } = render(<TradingViewTicker />);
    
    // Check if script tag was created and appended
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script?.src).toBe('https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js');
    expect(script?.type).toBe('text/javascript');
    
    // Check innerHTML contains NIFTY and RELIANCE
    const inner = script?.innerHTML;
    expect(inner).toContain('NSE:NIFTY');
    expect(inner).toContain('NSE:RELIANCE');
  });

  it('cleans up script on unmount', () => {
    const { container, unmount } = render(<TradingViewTicker />);
    expect(container.querySelector('script')).toBeInTheDocument();
    
    unmount();
    
    // Once unmounted, the script should be removed from the container
    expect(container.innerHTML).toBe('');
  });
});

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StockSearch from '../StockSearch';

describe('StockSearch Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        results: [
          { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', type: 'EQ' },
          { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', type: 'EQ' },
        ]
      })
    }) as any;
  });

  it('renders search input', () => {
    render(<StockSearch onSelect={() => {}} />);
    expect(screen.getByPlaceholderText('Search any stock by name, symbol...')).toBeInTheDocument();
  });

  it('fetches default suggestions on mount and shows them on focus', async () => {
    render(<StockSearch onSelect={() => {}} />);
    
    const input = screen.getByPlaceholderText('Search any stock by name, symbol...');
    
    // Wait for initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/search?q=Nifty');
    });
    
    fireEvent.focus(input);
    
    expect(screen.getByText('RELIANCE')).toBeInTheDocument();
    expect(screen.getByText('Reliance Industries')).toBeInTheDocument();
  });

  it('debounces user input and fetches results', async () => {
    vi.useFakeTimers();
    
    render(<StockSearch onSelect={() => {}} />);
    
    const input = screen.getByPlaceholderText('Search any stock by name, symbol...');
    
    fireEvent.change(input, { target: { value: 'TCS' } });
    
    // Initial default fetch already happened, now wait for search fetch
    act(() => {
      vi.advanceTimersByTime(500); // Past 450ms debounce
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/search?q=TCS');
    });
    
    vi.useRealTimers();
  });

  it('calls onSelect when a result is clicked', async () => {
    const onSelect = vi.fn();
    render(<StockSearch onSelect={onSelect} />);
    
    const input = screen.getByPlaceholderText('Search any stock by name, symbol...');
    fireEvent.focus(input);
    
    const relianceOption = await screen.findByText('RELIANCE');
    fireEvent.click(relianceOption);
    
    expect(onSelect).toHaveBeenCalledWith('RELIANCE');
  });
});

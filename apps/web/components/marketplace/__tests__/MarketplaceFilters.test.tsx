import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MarketplaceFilters from '../MarketplaceFilters';

const mockPush = vi.fn();
const mockReplaceState = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(''),
}));

// Mock window.history
Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
});

describe('MarketplaceFilters Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders default filter states correctly', () => {
    render(<MarketplaceFilters />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
    
    // Check radio buttons
    const allRadio = screen.getByLabelText(/all/i) as HTMLInputElement;
    expect(allRadio.checked).toBe(true);
    
    // Check range sliders
    const ranges = screen.getAllByRole('slider') as HTMLInputElement[];
    expect(ranges[0]!.value).toBe('0'); // minCagr
    expect(ranges[1]!.value).toBe('100'); // maxDd
    expect(ranges[2]!.value).toBe('0'); // minCapital
  });

  it('updates filters and URL on change', () => {
    vi.useFakeTimers();
    render(<MarketplaceFilters />);
    
    const whiteBoxRadio = screen.getByLabelText(/white box/i) as HTMLInputElement;
    fireEvent.click(whiteBoxRadio);
    
    act(() => {
      vi.advanceTimersByTime(350); // Advance past debounce 300ms
    });
    
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', expect.stringContaining('classification=white_box'));
    vi.useRealTimers();
  });
});

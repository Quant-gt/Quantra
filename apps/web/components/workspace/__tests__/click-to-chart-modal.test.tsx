import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClickToChartModal } from '../click-to-chart-modal';

// Mock lightweight-charts
vi.mock('lightweight-charts', () => ({
  createChart: vi.fn(() => ({
    addSeries: vi.fn(() => ({
      setData: vi.fn(),
    })),
    timeScale: vi.fn(() => ({
      fitContent: vi.fn(),
    })),
    removeSeries: vi.fn(),
    remove: vi.fn(),
    applyOptions: vi.fn(),
  })),
  ColorType: { Solid: 'Solid' },
  CandlestickSeries: 'CandlestickSeries',
  LineSeries: 'LineSeries',
}));

describe('ClickToChartModal Component', () => {
  const mockData = [
    { time: '2023-01-01', open: 100, high: 110, low: 90, close: 105, volume: 1000 },
    { time: '2023-01-02', open: 105, high: 115, low: 100, close: 112, volume: 1200 },
  ];

  it('renders nothing when closed', () => {
    render(<ClickToChartModal isOpen={false} onClose={() => {}} ticker="RELIANCE" exchange="NSE" />);
    expect(screen.queryByText('RELIANCE')).not.toBeInTheDocument();
  });

  it('renders modal with ticker and exchange', () => {
    render(<ClickToChartModal isOpen={true} onClose={() => {}} ticker="RELIANCE" exchange="NSE" data={mockData} />);
    
    expect(screen.getByText('RELIANCE')).toBeInTheDocument();
    expect(screen.getByText('NSE')).toBeInTheDocument();
  });

  it('shows loading state when fetching data', () => {
    // We don't provide external data, so it will try to fetch
    global.fetch = vi.fn(() => new Promise(() => {})) as any; // Never resolves
    
    render(<ClickToChartModal isOpen={true} onClose={() => {}} ticker="RELIANCE" exchange="NSE" />);
    
    expect(screen.getByText(/Loading live data/i)).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<ClickToChartModal isOpen={true} onClose={() => {}} ticker="RELIANCE" exchange="NSE" />);
    
    expect(await screen.findByText('Failed to stream data')).toBeInTheDocument();
  });

  it('renders chart data metrics correctly', () => {
    render(<ClickToChartModal isOpen={true} onClose={() => {}} ticker="RELIANCE" exchange="NSE" data={mockData} />);
    
    // Previous close 105, Latest close 112
    // Change = ((112 - 105) / 105) * 100 = 6.666%
    expect(screen.getByText('₹112.00')).toBeInTheDocument();
    expect(screen.getByText('+6.67%')).toBeInTheDocument();
  });
});

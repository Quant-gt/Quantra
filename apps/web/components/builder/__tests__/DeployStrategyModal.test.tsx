import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeployStrategyModal } from '../DeployStrategyModal';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock global fetch
global.fetch = vi.fn();

describe('DeployStrategyModal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    strategyName: 'Test Strategy',
    sourceModule: 'magic_scanner' as const,
    strategyData: { dummy: 'data' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<DeployStrategyModal {...defaultProps} />);
    expect(screen.getByText('Quick Deploy')).toBeInTheDocument();
    expect(screen.getByText('Test Strategy')).toBeInTheDocument();
    expect(screen.getByText('Confirm & Launch')).toBeInTheDocument();
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(<DeployStrategyModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('toggles execution modes successfully', () => {
    render(<DeployStrategyModal {...defaultProps} />);
    
    const liveTradeBtn = screen.getByText('Live Trade');
    const paperTradeBtn = screen.getByText('Paper Trading');

    // Default should be paper
    expect(screen.queryByText('Integrated Brokerage')).not.toBeInTheDocument();

    // Click Live
    fireEvent.click(liveTradeBtn);
    expect(screen.getByText('Integrated Brokerage')).toBeInTheDocument();

    // Click Paper
    fireEvent.click(paperTradeBtn);
    expect(screen.queryByText('Integrated Brokerage')).not.toBeInTheDocument();
  });

  it('handles successful deployment', async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
    
    render(<DeployStrategyModal {...defaultProps} />);
    
    const launchBtn = screen.getByText('Confirm & Launch');
    fireEvent.click(launchBtn);

    // Should show loading state
    expect(screen.getByText('Deploying...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/strategies/deploy', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String)
      }));
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Strategy successfully deployed'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles failed deployment', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    render(<DeployStrategyModal {...defaultProps} />);
    
    const launchBtn = screen.getByText('Confirm & Launch');
    fireEvent.click(launchBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to deploy strategy. Please try again.');
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BacktestModal from '../BacktestModal'
import userEvent from '@testing-library/user-event'

// Mock Recharts because it uses ResizeObserver and complex DOM measurements
vi.mock('recharts', () => {
  const OriginalRecharts = vi.importActual('recharts')
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div data-testid="recharts-container">{children}</div>,
    AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />
  }
})

describe('BacktestModal Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Default fetch mock (success response)
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          metrics: {
            total_return_pct: 12.4,
            win_rate: 65.5,
            max_drawdown_pct: 2.3,
            sharpe_ratio: 1.5,
            sortino_ratio: 2.1,
            profit_factor: 1.8
          },
          trades: [],
          equity_curve: [
            { date: '2023-01-01', equity: 100000 },
            { date: '2023-01-02', equity: 105000 }
          ]
        })
      })
    )
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <BacktestModal isOpen={false} onClose={mockOnClose} strategyId="strat-123" />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly when isOpen is true', () => {
    render(<BacktestModal isOpen={true} onClose={mockOnClose} strategyId="strat-123" />)
    
    expect(screen.getByText('Backtesting Engine')).toBeInTheDocument()
    expect(screen.getByDisplayValue('RELIANCE')).toBeInTheDocument()
    expect(screen.getByDisplayValue('100000')).toBeInTheDocument()
  })

  it('runs backtest and displays results on success', async () => {
    render(<BacktestModal isOpen={true} onClose={mockOnClose} strategyId="strat-123" />)
    
    const runBtn = screen.getByText('Run Test')
    fireEvent.click(runBtn)
    
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    
    // Verify fetch was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/execute/backtest', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy_id: 'strat-123', symbol: 'RELIANCE', initial_capital: 100000 })
      }))
    })

    // Verify metrics are displayed
    expect(await screen.findByText('65.5%')).toBeInTheDocument() // Win Rate
    expect(await screen.findByText('+12.4%')).toBeInTheDocument() // Total Return
    expect(await screen.findByText('-2.3%')).toBeInTheDocument() // Max DD
    expect(await screen.findByText('1.5')).toBeInTheDocument() // Sharpe
    expect(await screen.findByText('2.1')).toBeInTheDocument() // Sortino
    
    // Ensure chart renders
    expect(screen.getByTestId('recharts-container')).toBeInTheDocument()
  })

  it('displays error message on failure', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, error: 'Insufficient historical data' })
      })
    )

    render(<BacktestModal isOpen={true} onClose={mockOnClose} strategyId="strat-123" />)
    
    const runBtn = screen.getByText('Run Test')
    fireEvent.click(runBtn)
    
    expect(await screen.findByText('Insufficient historical data')).toBeInTheDocument()
  })
})

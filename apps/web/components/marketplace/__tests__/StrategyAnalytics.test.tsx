import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import StrategyAnalytics from '../StrategyAnalytics'

// Mock Recharts to avoid rendering actual SVG which can cause issues in jsdom
vi.mock('recharts', () => {
  const OriginalRecharts = vi.importActual('recharts')
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart" />,
    AreaChart: () => <div data-testid="area-chart" />,
    Line: () => <div />,
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />
  }
})

const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockOrder = vi.fn()
const mockLimit = vi.fn()
const mockMaybeSingle = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: mockSelect.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      order: mockOrder.mockReturnThis(),
      limit: mockLimit.mockReturnThis(),
      maybeSingle: mockMaybeSingle
    }))
  })
}))

describe('StrategyAnalytics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders fallback charts when no strategyId is provided', async () => {
    render(<StrategyAnalytics />)
    
    // Initially shows skeleton/loading state
    // But since it loads fast, it might already show charts
    await waitFor(() => {
      expect(screen.getByText('Equity Curve')).toBeInTheDocument()
      expect(screen.getByText('Drawdown Profile')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })
  })

  it('fetches and displays backtest equity curve if available', async () => {
    mockLimit.mockResolvedValueOnce({
      data: [{ equity_curve: [{ month: 'Jan', strategy: 100, benchmark: 100, drawdown: 0 }] }]
    })

    render(<StrategyAnalytics strategyId="strat-123" />)
    
    await waitFor(() => {
      expect(mockEq).toHaveBeenCalledWith('strategy_id', 'strat-123')
      expect(mockEq).toHaveBeenCalledWith('status', 'completed')
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  it('fetches metrics and projects data if no backtest results', async () => {
    mockLimit.mockResolvedValueOnce({ data: [] }) // no backtest
    mockMaybeSingle.mockResolvedValueOnce({
      data: { cagr: 25, max_drawdown: 10 }
    })

    render(<StrategyAnalytics strategyId="strat-123" />)
    
    await waitFor(() => {
      expect(mockMaybeSingle).toHaveBeenCalled()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  it('handles database error gracefully', async () => {
    mockLimit.mockRejectedValueOnce(new Error('DB Error'))

    render(<StrategyAnalytics strategyId="strat-123" />)
    
    // Should fallback to generated data without crashing
    await waitFor(() => {
      expect(screen.getByText('Equity Curve')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })
})

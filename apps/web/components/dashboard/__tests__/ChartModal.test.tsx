import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartModal } from '../ChartModal'

// Mock the ScreenerContext
const mockUseScreener = vi.fn()
vi.mock('@/context/ScreenerContext', () => ({
  useScreener: () => mockUseScreener()
}))

// Mock UI Dialog since radix-ui can be tricky in tests
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
}))

describe('ChartModal Component', () => {
  const mockSetIsChartOpen = vi.fn()
  const mockSetActiveIndicators = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseScreener.mockReturnValue({
      activeStockToken: 'RELIANCE',
      isChartOpen: true,
      setIsChartOpen: mockSetIsChartOpen,
      activeIndicators: ['EMA 20', 'RSI'],
      setActiveIndicators: mockSetActiveIndicators
    })
  })

  it('renders correctly when open', () => {
    render(<ChartModal />)
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText('RELIANCE')).toBeInTheDocument()
    expect(screen.getByText('EMA Cross')).toBeInTheDocument()
    expect(screen.getByText('EMA 20')).toBeInTheDocument()
    expect(screen.getByText('RSI')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    mockUseScreener.mockReturnValue({
      isChartOpen: false,
      activeIndicators: []
    })
    
    const { container } = render(<ChartModal />)
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })

  it('removes an active indicator when X is clicked', () => {
    const { container } = render(<ChartModal />)
    
    // Find the X icon within the EMA 20 badge. Since we mocked lucide-react as X (actually we didn't mock lucide-react, so it renders svg)
    // We can just find the SVGs
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
    
    // Click the first X icon
    fireEvent.click(svgs[0])
    
    expect(mockSetActiveIndicators).toHaveBeenCalledTimes(1)
    // It should have filtered out 'EMA 20', leaving ['RSI']
    expect(mockSetActiveIndicators).toHaveBeenCalledWith(['RSI'])
  })

  it('shows fallback text when no activeStockToken is provided', () => {
    mockUseScreener.mockReturnValue({
      activeStockToken: null,
      isChartOpen: true,
      activeIndicators: []
    })
    
    render(<ChartModal />)
    expect(screen.getByText('Select an Asset')).toBeInTheDocument()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CheckoutModal from '../CheckoutModal'

// Mock fetch for the API call
global.fetch = vi.fn()

const mockStrategy = {
  id: 'strat-1',
  name: 'Alpha AI Strategy',
  creator_name: 'QuantMaster',
  description: 'AI powered strategy',
  fee: 2500,
  win_rate: '65%',
  cagr: '30%',
  drawdown: '10%',
  subscribers: 100,
  min_capital: '10000',
  type: 'AI' as 'AI',
  risk_level: 'Medium' as 'Medium',
  rating: 4.8
}

describe('CheckoutModal Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })
  
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CheckoutModal strategy={mockStrategy} isOpen={false} onClose={mockOnClose} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly when open', () => {
    render(
      <CheckoutModal strategy={mockStrategy} isOpen={true} onClose={mockOnClose} />
    )
    
    expect(screen.getByText('Secure Checkout')).toBeInTheDocument()
    expect(screen.getByText('Alpha AI Strategy')).toBeInTheDocument()
    expect(screen.getByText('by QuantMaster')).toBeInTheDocument()
    expect(screen.getByText('Subscribe Now (₹2500)')).toBeInTheDocument()
  })

  it('handles successful subscription', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    ;(global.fetch as any).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ success: true })
    })

    render(
      <CheckoutModal strategy={mockStrategy} isOpen={true} onClose={mockOnClose} />
    )
    
    const subscribeBtn = screen.getByRole('button', { name: /Subscribe Now/i })
    fireEvent.click(subscribeBtn)
    
    expect(screen.getByText('Processing Payment...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Subscription Confirmed!')).toBeInTheDocument()
    })
    
    expect(screen.getByText('You are now subscribed to Alpha AI Strategy.')).toBeInTheDocument()
    
    // Fast forward 2 seconds to trigger onClose
    vi.advanceTimersByTime(2000)
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
    
    vi.useRealTimers()
  })

  it('handles failed subscription', async () => {
    window.alert = vi.fn()
    ;(global.fetch as any).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ success: false })
    })

    render(
      <CheckoutModal strategy={mockStrategy} isOpen={true} onClose={mockOnClose} />
    )
    
    const subscribeBtn = screen.getByRole('button', { name: /Subscribe Now/i })
    fireEvent.click(subscribeBtn)
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Payment failed')
    })
    
    // UI should reset
    expect(screen.getByText('Subscribe Now (₹2500)')).toBeInTheDocument()
  })

  it('handles network error', async () => {
    window.alert = vi.fn()
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(
      <CheckoutModal strategy={mockStrategy} isOpen={true} onClose={mockOnClose} />
    )
    
    const subscribeBtn = screen.getByRole('button', { name: /Subscribe Now/i })
    fireEvent.click(subscribeBtn)
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Network error')
    })
    
    expect(screen.getByText('Subscribe Now (₹2500)')).toBeInTheDocument()
  })
})

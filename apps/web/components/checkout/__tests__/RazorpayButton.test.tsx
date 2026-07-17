import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RazorpayButton from '../RazorpayButton'

// Mock next/script
vi.mock('next/script', () => {
  return {
    default: () => <div data-testid="razorpay-script"></div>
  }
})

describe('RazorpayButton Component', () => {
  const mockRazorpay = vi.fn()
  const mockOn = vi.fn()
  const mockOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock the global Razorpay object
    ;(window as any).Razorpay = vi.fn().mockImplementation(function(this: any) {
      this.on = mockOn;
      this.open = mockOpen;
    })
    
    global.fetch = vi.fn()
    window.alert = vi.fn()
    
    // Set the env var
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'test_key_123'
  })

  it('renders correctly', () => {
    render(<RazorpayButton type="subscription" userId="user-1" buttonText="Pay Now" />)
    expect(screen.getByRole('button', { name: /Pay Now/i })).toBeInTheDocument()
  })

  it('shows error modal if NEXT_PUBLIC_RAZORPAY_KEY_ID is missing', async () => {
    delete process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    
    render(<RazorpayButton type="subscription" userId="user-1" buttonText="Pay Now" />)
    
    const btn = screen.getByRole('button', { name: /Pay Now/i })
    fireEvent.click(btn)
    
    expect(await screen.findByText('Integration Pending')).toBeInTheDocument()
    expect(screen.getByText(/Payment integration gateway initializing/i)).toBeInTheDocument()
    
    // Acknowledge removes error
    fireEvent.click(screen.getByRole('button', { name: /Acknowledge/i }))
    
    await waitFor(() => {
      expect(screen.queryByText('Integration Pending')).not.toBeInTheDocument()
    })
  })

  it('handles subscription payment flow', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ id: 'sub_123' })
    })

    render(<RazorpayButton type="subscription" planTierId="pro" userId="user-1" buttonText="Subscribe" />)
    
    const btn = screen.getByRole('button', { name: /Subscribe/i })
    fireEvent.click(btn)
    
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/payments/razorpay/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId: 'pro', userId: 'user-1' })
      })
      
      expect((window as any).Razorpay).toHaveBeenCalledWith(expect.objectContaining({
        key: 'test_key_123',
        subscription_id: 'sub_123'
      }))
      expect(mockOpen).toHaveBeenCalled()
    })
  })

  it('handles marketplace checkout flow', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ id: 'order_123', amount: 50000 }) // 500.00 INR
    })

    render(
      <RazorpayButton 
        type="marketplace_split" 
        strategyId="strat-1"
        creatorId="creator-1"
        amountInr={500}
        userId="user-1" 
        buttonText="Buy Strategy" 
      />
    )
    
    const btn = screen.getByRole('button', { name: /Buy Strategy/i })
    fireEvent.click(btn)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/payments/razorpay/route-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyId: 'strat-1', creatorId: 'creator-1', amountInr: 500, userId: 'user-1' })
      })
      
      expect((window as any).Razorpay).toHaveBeenCalledWith(expect.objectContaining({
        key: 'test_key_123',
        order_id: 'order_123',
        amount: 50000 // converted amount
      }))
      expect(mockOpen).toHaveBeenCalled()
    })
  })

  it('handles api fetch error gracefully', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ error: 'Backend error' })
    })

    render(<RazorpayButton type="subscription" userId="user-1" buttonText="Subscribe" />)
    
    const btn = screen.getByRole('button', { name: /Subscribe/i })
    fireEvent.click(btn)
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error initiating checkout: Backend error')
      expect(mockOpen).not.toHaveBeenCalled()
    })
  })
})

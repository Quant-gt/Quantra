import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import AdminMarketplace from '../AdminMarketplace'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('AdminMarketplace Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {}))
    render(<AdminMarketplace />)
    expect(screen.getByText('Loading algorithms...')).toBeInTheDocument()
  })

  it('renders strategies list successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        strategies: [
          {
            id: '1',
            name: 'Momentum Scalper v1',
            status: 'published',
            creator_name: 'Jane Creator',
            creator_email: 'jane@example.com',
            monthly_fee: 1500,
            subscriber_count: 45
          }
        ]
      })
    })

    render(<AdminMarketplace />)

    await waitFor(() => {
      expect(screen.queryByText('Loading algorithms...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Marketplace Algorithms')).toBeInTheDocument()
    
    // Check strategy info
    expect(screen.getByText('Momentum Scalper v1')).toBeInTheDocument()
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument()
    
    // Check creator info
    expect(screen.getByText('Jane Creator')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    
    // Check performance/subs
    expect(screen.getByText('₹1500/mo')).toBeInTheDocument()
    expect(screen.getByText('45 Active Subscribers')).toBeInTheDocument()
  })

  it('renders empty state if no strategies found', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ strategies: [] })
    })

    render(<AdminMarketplace />)

    await waitFor(() => {
      expect(screen.queryByText('Loading algorithms...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('No strategies found in the database.')).toBeInTheDocument()
  })

  it('handles fetch error gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<AdminMarketplace />)
    
    expect(screen.getByText('Loading algorithms...')).toBeInTheDocument()

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled()
    })
  })
})

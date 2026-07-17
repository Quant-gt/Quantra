import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import AdminOverview from '../AdminOverview'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('AdminOverview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {}))
    render(<AdminOverview />)
    expect(screen.getByText('Loading system metrics...')).toBeInTheDocument()
  })

  it('renders stats successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        stats: {
          totalUsers: 15200,
          activeSubscriptions: 3450,
          mrr: 2500000,
          publishedAlgos: 124
        }
      })
    })

    render(<AdminOverview />)

    await waitFor(() => {
      expect(screen.queryByText('Loading system metrics...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Platform Overview')).toBeInTheDocument()
    
    // Check specific stats with formatting
    expect(screen.getByText('15,200')).toBeInTheDocument()
    expect(screen.getByText('3,450')).toBeInTheDocument()
    // Match either US or Indian number formatting
    expect(screen.getByText(/₹2[.,]500[.,]000|₹25[.,]00[.,]000/)).toBeInTheDocument()
    expect(screen.getByText('124')).toBeInTheDocument()
    
    // Check static text
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Rev')).toBeInTheDocument()
    expect(screen.getByText('Published Algos')).toBeInTheDocument()
  })

  it('handles fetch error gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValueOnce(new Error('Network Error'))

    render(<AdminOverview />)

    // Wait for the promise rejection to be handled
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled()
    })
    
    // It will remain in loading state since setStats is not called
    expect(screen.getByText('Loading system metrics...')).toBeInTheDocument()
  })
})

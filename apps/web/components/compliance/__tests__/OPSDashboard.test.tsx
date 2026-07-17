import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import OPSDashboard from '../OPSDashboard'

// Mock Supabase Client
const mockSelect = vi.fn()
const mockEq = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: [{ current_ops: '4.5' }] }) })

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: mockEq
      }))
    }))
  })
}))

describe('OPSDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly and displays real-time OPS monitor header', () => {
    render(<OPSDashboard />)
    
    expect(screen.getByText('Real-time OPS Monitor')).toBeInTheDocument()
    expect(screen.getByText('SEBI Mandate: Max 10 Orders Per Second')).toBeInTheDocument()
  })

  it('fetches and displays the current OPS value', async () => {
    render(<OPSDashboard />)
    
    // Wait for the mock to resolve and component to update
    await waitFor(() => {
      expect(screen.getByText('4.5 OPS')).toBeInTheDocument()
    })
  })

  it('polls for updates every 2 seconds', async () => {
    // Override the mock to return 0 first, then 8.2
    let callCount = 0
    mockEq.mockImplementation(() => {
      callCount++
      const opsValue = callCount === 1 ? '0' : '8.2'
      return {
        limit: vi.fn().mockResolvedValue({ data: [{ current_ops: opsValue }] })
      }
    })

    render(<OPSDashboard />)
    
    // Initially fetches 0 on mount
    await waitFor(() => {
      expect(screen.getByText('0.0 OPS')).toBeInTheDocument()
    })
    
    // Should now fetch and display 8.2 after 2 seconds
    await waitFor(() => {
      expect(screen.getByText('8.2 OPS')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('defaults to 0 OPS when no data is returned', async () => {
    mockEq.mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: [] }) })
    
    render(<OPSDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('0.0 OPS')).toBeInTheDocument()
    })
  })
})

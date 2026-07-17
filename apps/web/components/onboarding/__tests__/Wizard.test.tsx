import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Wizard from '../Wizard'

// Mock dependencies
const mockPush = vi.fn()
const mockRouter = { push: mockPush }
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({}))
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Wizard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to auth if not authenticated (401)', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false
    })

    render(<Wizard />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth')
    })
  })

  it('loads onboarding progress and sets step', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        profile_wizard_step: 1, // Step 2 (0-indexed)
        preferences: { experience: 'Intermediate' }
      })
    })

    render(<Wizard />)

    // Should wait until loading finishes and renders the step
    await waitFor(() => {
      expect(screen.getByText('Execution Paradigm')).toBeInTheDocument()
    })
    
    // Shows progress
    expect(screen.getByText(/STEP 02 \/ 05/i)).toBeInTheDocument()
  })

  it('redirects to dashboard if onboarding is complete', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        profile_wizard_step: 5,
        preferences: {}
      })
    })

    render(<Wizard />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('allows selection and proceeds to next step', async () => {
    // Initial load
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        profile_wizard_step: 0,
        preferences: {}
      })
    })
    
    // Save request
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true
    })

    render(<Wizard />)

    await waitFor(() => {
      expect(screen.getByText('Trading Experience')).toBeInTheDocument()
    })

    // Find and click 'Intermediate'
    const intermediateBtn = screen.getByRole('button', { name: /Intermediate/i })
    fireEvent.click(intermediateBtn)
    
    // Find continue button (usually at the bottom)
    const continueBtn = screen.getByRole('button', { name: /Continue/i })
    fireEvent.click(continueBtn)

    // Verify it called save
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2) // load + save
    })
    
    // Verify it moved to the next step
    expect(screen.getByText('Execution Paradigm')).toBeInTheDocument()
  })
})

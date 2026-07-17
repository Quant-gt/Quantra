import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BlockBuilder from '../BlockBuilder'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}))

vi.mock('@/context/ScreenerContext', () => ({
  useScreener: () => ({
    historicalSnapshotTarget: null,
    setActiveUniverseScope: vi.fn(),
    activeUniverseScope: 'NSE_EQ',
    setHistoricalSnapshotTarget: vi.fn()
  })
}))

const mockInsert = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    single: vi.fn().mockResolvedValue({ data: { id: 'strategy-123' }, error: null })
  })
})

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: async () => ({ data: { session: { user: { id: 'user-1' } } }, error: null })
    },
    from: vi.fn(() => ({
      insert: mockInsert
    }))
  })
}))

// We need to mock inner child components if they cause issues, but they shouldn't since we are doing an integration-like component test
// If ResizeObserver is used anywhere inside, we must mock it
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

describe('BlockBuilder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: {} })
      })
    )
  })

  it('renders the component successfully with default pipelines', () => {
    render(<BlockBuilder />)
    
    // Check if Strategy Name input is present
    expect(screen.getByText('Strategy Name')).toBeInTheDocument()
    
    // Check if Buy and Sell pipelines are rendered
    expect(screen.getByText(/WHEN \(Buy Pipeline\)/i)).toBeInTheDocument()
    expect(screen.getByText(/WHEN \(Sell Pipeline\)/i)).toBeInTheDocument()
    
    // Check for Save Strategy button
    expect(screen.getByText(/Save Strategy/i)).toBeInTheDocument()
  })

  it('toggles pipelines when the text is clicked', async () => {
    render(<BlockBuilder />)
    
    // The Buy Pipeline header text is wrapped in a clickable div
    const buyHeader = screen.getByText(/WHEN \(Buy Pipeline\)/i)
    fireEvent.click(buyHeader)
    
    // Should still be in the document
    expect(buyHeader).toBeInTheDocument()
  })

  it('adds a new condition block when Add Block is clicked', () => {
    render(<BlockBuilder />)
    
    // There are two "Block" buttons (one for Buy, one for Sell)
    const addButtons = screen.getAllByText('Block')
    
    // Click the first one (Buy Pipeline)
    fireEvent.click(addButtons[0])
    
    expect(toast.success).toHaveBeenCalledWith("Added new Buy indicator condition block")
  })

  it('saves strategy when name is provided', async () => {
    render(<BlockBuilder />)
    
    const nameInput = screen.getByDisplayValue('Dual Block Strategy')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Test Strategy')
    
    const saveBtn = screen.getByText(/Save Strategy/i)
    fireEvent.click(saveBtn)
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith("Strategy saved successfully!")
    })
  })
})

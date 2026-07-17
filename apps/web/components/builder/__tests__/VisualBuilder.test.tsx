import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import VisualBuilder from '../VisualBuilder'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'

// --- Mock ResizeObserver for React Flow ---
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock

// --- Mock Dependencies ---
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn().mockReturnValue('toast-id'),
    dismiss: vi.fn()
  }
}))

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  })
}))

// Mock Supabase
const mockInsert = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    single: vi.fn().mockResolvedValue({ data: { id: 'visual-strategy-123' }, error: null })
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

describe('VisualBuilder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Stub fetch for global if it makes any external calls on mount
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: {} })
      })
    )
    
    // Mock getBoundingClientRect for ReactFlow
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 1000,
      height: 800,
      top: 0,
      left: 0,
      bottom: 800,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))
  })

  it('renders successfully with default nodes', () => {
    render(<VisualBuilder />)
    
    // Verify toolbar items
    expect(screen.getByDisplayValue('My Momentum Strategy')).toBeInTheDocument()
    expect(screen.getByText(/Save Draft/i)).toBeInTheDocument()
    
    // Verify draggable sidebar elements exist
    expect(screen.getByText('EVENTS & TRIGGERS')).toBeInTheDocument()
    expect(screen.getByText('LOGIC & MATH')).toBeInTheDocument()
    expect(screen.getByText('Time/Tick')).toBeInTheDocument()
  })

  it('saves visual strategy when name is provided', async () => {
    render(<VisualBuilder />)
    
    // Change Strategy Name
    const nameInput = screen.getByDisplayValue('My Momentum Strategy')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Flow Strategy')
    
    // Click Save
    const saveBtn = screen.getByText(/Save Draft/i)
    fireEvent.click(saveBtn)
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith("Strategy saved successfully!")
    })
  })
})

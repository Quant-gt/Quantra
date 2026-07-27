import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import MagicFilter from '../MagicFilter'
import userEvent from '@testing-library/user-event'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

import { toast } from 'sonner'

describe('MagicFilter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders input field correctly', () => {
    render(<MagicFilter />)
    expect(screen.getByPlaceholderText(/Ask AI/i)).toBeInTheDocument()
  })

  it('shows suggestions dropdown on input matching trending search', () => {
    render(<MagicFilter />)
    
    const input = screen.getByPlaceholderText(/Ask AI/i)
    fireEvent.change(input, { target: { value: 'safe nifty' } })
    
    // Advance timers for debounce inside act
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
    expect(screen.getAllByText('safe nifty options under 50k').length).toBeGreaterThan(0)
  })

  it('shows trending searches by default if typing does not match but >2 chars', () => {
    render(<MagicFilter />)
    
    const input = screen.getByPlaceholderText(/Ask AI/i)
    fireEvent.change(input, { target: { value: 'unknown strategy' } })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(screen.getByText('No direct matches. Press Enter to search anyway.')).toBeInTheDocument()
    expect(screen.getByText('Trending Searches')).toBeInTheDocument()
  })

  it('clears input when clicking clear button', () => {
    const { container } = render(<MagicFilter />)
    
    const input = screen.getByPlaceholderText(/Ask AI/i)
    fireEvent.change(input, { target: { value: 'safe nifty' } })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    // Find the clear button which is the first button inside the pr-2 flex div
    const clearBtn = container.querySelector('button.text-white\\/50') as HTMLButtonElement
    fireEvent.click(clearBtn)
    
    expect(input).toHaveValue('')
  })

  it('handles search submission correctly', async () => {
    const { container } = render(<MagicFilter />)
    
    const input = screen.getByPlaceholderText(/Ask AI/i)
    fireEvent.change(input, { target: { value: 'my awesome strategy' } })
    
    const submitBtn = container.querySelector('button.bg-primary') as HTMLButtonElement
    fireEvent.click(submitBtn)
    
    // Simulate the async delay in handleSearch
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('AI Search triggered for: "my awesome strategy"'))
  })

  it('handles speech recognition unsupported error', () => {
    const { container } = render(<MagicFilter />)
    
    // Find the voice button
    const voiceBtn = container.querySelectorAll('button')[0] as HTMLButtonElement
    fireEvent.click(voiceBtn)
    
    expect(toast.error).toHaveBeenCalledWith('Voice search is not supported in this browser.')
  })

  it('handles speech recognition when supported', () => {
    const mockStart = vi.fn()
    class MockSpeechRecognition {
      lang = '';
      interimResults = false;
      maxAlternatives = 1;
      onstart = null;
      onresult = null;
      onerror = null;
      onend = null;
      start = mockStart;
    }
    
    ;(window as any).SpeechRecognition = MockSpeechRecognition
    
    const { container } = render(<MagicFilter />)
    
    const voiceBtn = container.querySelectorAll('button')[0] as HTMLButtonElement
    fireEvent.click(voiceBtn)
    
    expect(mockStart).toHaveBeenCalled()
  })
})

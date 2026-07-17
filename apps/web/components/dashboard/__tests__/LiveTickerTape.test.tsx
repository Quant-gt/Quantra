import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import LiveTickerTape from '../LiveTickerTape'

import { feed } from '@/lib/engine/feed'

vi.mock('@/lib/engine/feed', () => ({
  feed: {
    subscribe: vi.fn(() => vi.fn())
  }
}))

describe('LiveTickerTape Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders initial loading state for symbols', () => {
    render(<LiveTickerTape />)
    
    // Check if initial symbols are rendered in loading state
    expect(screen.getByText('NIFTY 50 Loading...')).toBeInTheDocument()
    expect(screen.getByText('RELIANCE Loading...')).toBeInTheDocument()
  })

  it('updates ticker when feed emits new data', () => {
    render(<LiveTickerTape />)
    
    // Simulate a feed tick
    act(() => {
      // Fast forward past the 500ms throttle first
      vi.advanceTimersByTime(600)
      
      const subscribeMock = feed.subscribe as any
      if (subscribeMock.mock.calls.length > 0) {
        const cb = subscribeMock.mock.calls[0][0]
        cb({
          symbol: 'RELIANCE',
          price: 2500.50,
          change: 15.20,
          changePct: 0.61,
          direction: 'up',
          timestamp: Date.now()
        })
      }
    })
    
    // Loading state for RELIANCE should be gone, price should be displayed
    expect(screen.queryByText('RELIANCE Loading...')).not.toBeInTheDocument()
    expect(screen.getByText('RELIANCE')).toBeInTheDocument()
    
    // 2500.50 should be formatted according to 'en-IN' if possible, or just look for the text
    expect(screen.getByText('2,500.50')).toBeInTheDocument()
    expect(screen.getByText(/\+15\.2 \(\+0\.61\%\)/)).toBeInTheDocument()
  })

  it('toggles paper trading mode', () => {
    render(<LiveTickerTape />)
    
    const paperBtn = screen.getByRole('button') // The toggle switch
    
    // Initially Paper is active
    expect(screen.getByText('PAPER')).toHaveClass('text-[#388BFD]')
    expect(screen.getByText('LIVE')).toHaveClass('text-gray-500')
    
    fireEvent.click(paperBtn)
    
    // After toggle, Live is active
    expect(screen.getByText('PAPER')).toHaveClass('text-gray-500')
    expect(screen.getByText('LIVE')).toHaveClass('text-[#F85149]')
  })
})

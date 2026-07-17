import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MorningReauth from '../MorningReauth'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

const mockGetUser = vi.fn()
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) })
const mockInsert = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser
    },
    from: vi.fn((table) => {
      if (table === 'marketplace_subscriptions') return { update: mockUpdate }
      if (table === 'compliance_audit') return { insert: mockInsert }
      return {}
    })
  })
}))

describe('MorningReauth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
  })

  it('renders default state correctly', () => {
    render(<MorningReauth />)
    
    expect(screen.getByText('Morning Re-Authentication')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument()
    
    const verifyBtn = screen.getByRole('button', { name: /Verify & Resume Live Trading/i })
    expect(verifyBtn).toBeDisabled()
  })

  it('enables submit button only when 6 digits are entered', async () => {
    render(<MorningReauth />)
    
    const input = screen.getByPlaceholderText('000000')
    const verifyBtn = screen.getByRole('button', { name: /Verify & Resume Live Trading/i })
    
    await userEvent.type(input, '123')
    expect(verifyBtn).toBeDisabled()
    
    await userEvent.type(input, '456')
    expect(input).toHaveValue('123456')
    expect(verifyBtn).toBeEnabled()
  })

  it('submits successfully and redirects to dashboard', async () => {
    render(<MorningReauth />)
    
    const input = screen.getByPlaceholderText('000000')
    await userEvent.type(input, '123456')
    
    const verifyBtn = screen.getByRole('button', { name: /Verify & Resume Live Trading/i })
    fireEvent.click(verifyBtn)
    
    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled()
      expect(mockUpdate).toHaveBeenCalled()
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-123',
        event_type: '2fa_completed'
      }))
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles invalid 2FA code error', async () => {
    render(<MorningReauth />)
    
    const input = screen.getByPlaceholderText('000000')
    // We can't actually type less than 6 digits and submit because the button is disabled,
    // but we can test auth errors or DB errors. Let's mock a DB error.
    mockUpdate.mockReturnValueOnce({ 
      eq: vi.fn().mockReturnValue({ 
        eq: vi.fn().mockResolvedValue({ error: new Error('Database connection failed') }) 
      }) 
    })
    
    await userEvent.type(input, '123456')
    
    const verifyBtn = screen.getByRole('button', { name: /Verify & Resume Live Trading/i })
    fireEvent.click(verifyBtn)
    
    expect(await screen.findByText('Database connection failed')).toBeInTheDocument()
  })
})

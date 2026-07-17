import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PANVerification from '../PANVerification'
import { createClient } from '@/lib/supabase/client'

// Mock Supabase Client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn()
}))

describe('PANVerification Component', () => {
  let mockGetUser: any
  let mockUpdate: any
  let mockEq: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockGetUser = vi.fn()
    mockEq = vi.fn()
    mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })

    ;(createClient as any).mockReturnValue({
      auth: {
        getUser: mockGetUser
      },
      from: vi.fn().mockReturnValue({
        update: mockUpdate
      })
    })
  })

  it('renders correctly', () => {
    render(<PANVerification />)
    expect(screen.getByText('PAN Verification')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ABCDE1234F')).toBeInTheDocument()
  })

  it('shows error for invalid PAN format', async () => {
    render(<PANVerification />)
    
    const input = screen.getByPlaceholderText('ABCDE1234F')
    fireEvent.change(input, { target: { value: 'INVALID123' } })
    
    const button = screen.getByRole('button', { name: /Verify PAN/i })
    fireEvent.click(button)
    
    expect(await screen.findByText('Invalid PAN format')).toBeInTheDocument()
    expect(mockGetUser).not.toHaveBeenCalled()
  })

  it('handles successful verification', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } })
    mockEq.mockResolvedValueOnce({ data: null, error: null })
    
    render(<PANVerification />)
    
    const input = screen.getByPlaceholderText('ABCDE1234F')
    fireEvent.change(input, { target: { value: 'ABCDE1234F' } })
    
    const button = screen.getByRole('button', { name: /Verify PAN/i })
    fireEvent.click(button)
    
    expect(screen.getByRole('button')).toHaveTextContent('Verifying with NSDL...')
    
    await waitFor(() => {
      expect(screen.getByText('Your PAN has been successfully verified.')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    expect(mockUpdate).toHaveBeenCalledWith({ kyc_status: 'verified' })
    expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
  })

  it('handles verification failure due to authentication error', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } }) // Not authenticated
    
    render(<PANVerification />)
    
    const input = screen.getByPlaceholderText('ABCDE1234F')
    fireEvent.change(input, { target: { value: 'ABCDE1234F' } })
    
    const button = screen.getByRole('button', { name: /Verify PAN/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument()
      expect(screen.getByText(/Verification failed\. Max 3 attempts/i)).toBeInTheDocument()
    })
  })
})

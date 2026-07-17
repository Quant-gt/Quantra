import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ComplianceDashboard from '../ComplianceDashboard'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ComplianceDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
    window.alert = vi.fn()
  })

  it('renders loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {}))
    render(<ComplianceDashboard />)
    expect(screen.getByText('Loading compliance queue...')).toBeInTheDocument()
  })

  it('renders requests and handles approval', async () => {
    const mockRequest = {
      id: 'req-1',
      user_name: 'John Creator',
      email: 'john@creator.com',
      pan_number: 'ABCDE1234F',
      is_ria: true,
      sebi_registration_number: 'INA123456789',
      status: 'pending',
      submitted_at: new Date().toISOString()
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ requests: [mockRequest] })
      })

    render(<ComplianceDashboard />)

    await waitFor(() => {
      expect(screen.queryByText('Loading compliance queue...')).not.toBeInTheDocument()
    })

    // Check if user is rendered
    expect(screen.getByText('John Creator')).toBeInTheDocument()
    expect(screen.getByText('ABCDE1234F')).toBeInTheDocument()
    expect(screen.getByText('INA123456789')).toBeInTheDocument()

    // Test NSDL Verify
    const verifyBtn = screen.getByText('Verify with NSDL')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { is_match: true, registered_name: 'JOHN CREATOR', message: 'Success' } })
    })

    fireEvent.click(verifyBtn)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/admin/kyc/req-1/verify', expect.objectContaining({ method: 'POST' }))
      expect(screen.getByText('Name Matched')).toBeInTheDocument()
      expect(screen.getByText('NSDL: JOHN CREATOR')).toBeInTheDocument()
    })

    // Test Approve Action
    // Find the approve button which contains the lucide-check icon
    const checkSvg = document.querySelector('.lucide-check')
    const approveBtn = checkSvg?.closest('button')

    if (approveBtn) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      fireEvent.click(approveBtn)

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled()
        expect(mockFetch).toHaveBeenCalledWith('/api/v1/admin/kyc/req-1', expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ action: 'approve' })
        }))
      })
    }
  })
})

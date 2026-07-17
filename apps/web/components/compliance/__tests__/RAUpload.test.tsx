import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RAUpload from '../RAUpload'
import userEvent from '@testing-library/user-event'

const mockGetUser = vi.fn()
const mockInsert = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser
    },
    from: vi.fn(() => ({
      insert: mockInsert
    }))
  })
}))

describe('RAUpload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-456' } } })
    // Mock global alert
    window.alert = vi.fn()
  })

  it('renders idle state by default', () => {
    render(<RAUpload />)
    
    expect(screen.getByText('SEBI RA Verification')).toBeInTheDocument()
    expect(screen.getByText('Click to upload SEBI RA Certificate')).toBeInTheDocument()
    
    const submitBtn = screen.getByRole('button', { name: /Submit for Verification/i })
    expect(submitBtn).toBeDisabled()
  })

  it('allows file selection and enables submit button', async () => {
    render(<RAUpload />)
    
    const file = new File(['dummy content'], 'certificate.pdf', { type: 'application/pdf' })
    
    // File inputs are tricky to test by label directly with userEvent in some cases, 
    // but we can query by type or label
    const input = screen.getByLabelText(/Click to upload SEBI RA Certificate/i) // This matches the text inside the label due to nesting
    // Actually the label text will change. Better to query by id.
    const fileInput = screen.getByLabelText(/Click to upload/i, { selector: 'input[type="file"]' })
    // Wait, testing-library has getByLabelText which finds the input associated with the label.
    // Let's use getByLabelText if possible. 
    // Wait, the label has htmlFor="file-upload", so it works.
    
    // But testing library is easier with document.querySelector or we can just grab it by type="file"
    const fileInputByQuery = document.getElementById('file-upload') as HTMLInputElement
    
    fireEvent.change(fileInputByQuery, { target: { files: [file] } })
    
    expect(screen.getByText('certificate.pdf')).toBeInTheDocument()
    
    const submitBtn = screen.getByRole('button', { name: /Submit for Verification/i })
    expect(submitBtn).toBeEnabled()
  })

  it('handles simulated upload and sets status to uploaded', async () => {
    render(<RAUpload />)
    
    const file = new File(['dummy content'], 'certificate.pdf', { type: 'application/pdf' })
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const submitBtn = screen.getByRole('button', { name: /Submit for Verification/i })
    fireEvent.click(submitBtn)
    
    // Should show uploading text immediately
    expect(screen.getByText('Uploading...')).toBeInTheDocument()
    
    // Wait for the mock 2-second timeout and insert to finish
    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled()
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-456',
        alert_type: 'ra_verification_request',
        message: 'User uploaded RA Certificate for review'
      })
      
      expect(screen.getByText('Under Review')).toBeInTheDocument()
      expect(screen.getByText(/Our compliance team will review your document within 48 hours/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles error gracefully if user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })
    
    render(<RAUpload />)
    
    const file = new File(['dummy content'], 'certificate.pdf', { type: 'application/pdf' })
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const submitBtn = screen.getByRole('button', { name: /Submit for Verification/i })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to upload document')
    })
    
    // Should go back to idle state
    expect(screen.getByText('Submit for Verification')).toBeInTheDocument()
  })
})

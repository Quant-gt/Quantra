import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmailSignUp from '../EmailSignUp'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

// Mock Supabase
const mockSignUp = vi.fn()
const mockSignInWithPassword = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword
    }
  })
}))

// Mock zxcvbn because it's a heavy library and we just need score calculation
vi.mock('zxcvbn', () => ({
  default: (password: string) => ({
    score: password.length > 5 ? 3 : 1
  })
}))

describe('EmailSignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign up form correctly', () => {
    render(<EmailSignUp mode="signup" />)
    
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('renders sign in form correctly', () => {
    render(<EmailSignUp mode="signin" />)
    
    // Full Name should not be in signin mode
    expect(screen.queryByPlaceholderText('John Doe')).not.toBeInTheDocument()
    
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
  })

  it('prevents weak passwords from signing up', async () => {
    render(<EmailSignUp mode="signup" />)
    
    const nameInput = screen.getByPlaceholderText('John Doe')
    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    
    await userEvent.type(nameInput, 'Test User')
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passInput, 'weak') // zxcvbn mock returns 1 for length <= 5
    
    const submitBtn = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitBtn)
    
    expect(await screen.findByText('Password is too weak. Add numbers and symbols.')).toBeInTheDocument()
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('successfully signs up and shows OTP', async () => {
    mockSignUp.mockResolvedValueOnce({ error: null })
    
    render(<EmailSignUp mode="signup" />)
    
    const nameInput = screen.getByPlaceholderText('John Doe')
    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    
    await userEvent.type(nameInput, 'Test User')
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passInput, 'strongpass') // score > 2
    
    const submitBtn = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'strongpass',
        options: { data: { full_name: 'Test User' } }
      })
    })
  })

  it('successfully signs in and routes to dashboard', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ error: null })
    
    render(<EmailSignUp mode="signin" />)
    
    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passInput, 'password123')
    
    const submitBtn = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays auth errors from Supabase', async () => {
    mockSignInWithPassword.mockRejectedValueOnce(new Error('Invalid credentials'))
    
    render(<EmailSignUp mode="signin" />)
    
    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passInput, 'wrongpass')
    
    const submitBtn = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitBtn)
    
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})

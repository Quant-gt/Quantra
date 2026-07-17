import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AuthForm from '../AuthForm'

// Mock the sub-components to test the parent tab switching logic
vi.mock('../EmailSignUp', () => ({
  default: ({ mode }: { mode: string }) => <div data-testid="email-signup">Email Form - {mode}</div>
}))
vi.mock('../MobileSignUp', () => ({
  default: ({ mode }: { mode: string }) => <div data-testid="mobile-signup">Mobile Form - {mode}</div>
}))
vi.mock('../OAuthButtons', () => ({
  default: () => <div data-testid="oauth-buttons">OAuth Buttons</div>
}))

describe('AuthForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders default state: signup mode and email method', () => {
    render(<AuthForm />)
    
    // Check Email form is visible in signup mode
    expect(screen.getByTestId('email-signup')).toHaveTextContent('Email Form - signup')
    expect(screen.queryByTestId('mobile-signup')).not.toBeInTheDocument()
    
    // Check OAuth buttons are always rendered
    expect(screen.getByTestId('oauth-buttons')).toBeInTheDocument()
  })

  it('switches between sign in and sign up modes', () => {
    render(<AuthForm />)
    
    const signInTab = screen.getByText('Sign In')
    fireEvent.click(signInTab)
    
    expect(screen.getByTestId('email-signup')).toHaveTextContent('Email Form - signin')
    
    const signUpTab = screen.getByText('Sign Up')
    fireEvent.click(signUpTab)
    
    expect(screen.getByTestId('email-signup')).toHaveTextContent('Email Form - signup')
  })

  it('switches between email and mobile methods', () => {
    render(<AuthForm />)
    
    const mobileTab = screen.getByText('Mobile')
    fireEvent.click(mobileTab)
    
    expect(screen.queryByTestId('email-signup')).not.toBeInTheDocument()
    expect(screen.getByTestId('mobile-signup')).toHaveTextContent('Mobile Form - signup')
    
    const emailTab = screen.getByText('Email')
    fireEvent.click(emailTab)
    
    expect(screen.getByTestId('email-signup')).toBeInTheDocument()
  })
})

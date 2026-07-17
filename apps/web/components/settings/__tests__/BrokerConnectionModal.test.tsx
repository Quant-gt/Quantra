import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BrokerConnectionModal from '../BrokerConnectionModal'
import userEvent from '@testing-library/user-event'

describe('BrokerConnectionModal Component', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <BrokerConnectionModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders broker selection screen by default', () => {
    render(
      <BrokerConnectionModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    )
    
    expect(screen.getByText('Select Your Broker')).toBeInTheDocument()
    expect(screen.getByText('Zerodha Kite')).toBeInTheDocument()
    expect(screen.getByText('Upstox')).toBeInTheDocument()
    expect(screen.getByText('Fyers')).toBeInTheDocument()
  })

  it('navigates to standard credentials screen when selecting Zerodha', async () => {
    render(
      <BrokerConnectionModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    )
    
    fireEvent.click(screen.getByText('Zerodha Kite'))
    
    expect(await screen.findByText('Connect Zerodha Kite')).toBeInTheDocument()
    expect(await screen.findByText('App ID / Client ID')).toBeInTheDocument()
    expect(screen.getByText('API Key')).toBeInTheDocument()
    expect(screen.getByText('API Secret')).toBeInTheDocument()
  })

  it('navigates to Fyers specific credentials screen', async () => {
    render(
      <BrokerConnectionModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    )
    
    fireEvent.click(screen.getByText('Fyers'))
    
    expect(await screen.findByText('Connect Fyers')).toBeInTheDocument()
    expect(await screen.findByText('Fyers Client ID (User ID)')).toBeInTheDocument()
    expect(screen.getByText('App ID')).toBeInTheDocument()
    expect(screen.getByText('Secret ID')).toBeInTheDocument()
  })

  it('simulates connection process and fires onSuccess', async () => {
    // We need real timers or properly managed fake timers. 
    // We are using fake timers in beforeEach.
    render(
      <BrokerConnectionModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    )
    
    // Select Broker
    fireEvent.click(screen.getByText('Zerodha Kite'))
    
    // Fill App ID (wait for it to render)
    const appIdInput = await screen.findByPlaceholderText('e.g. ZER123456')
    await userEvent.type(appIdInput, 'TESTAPP123')
    
    const keyInput = screen.getByPlaceholderText('••••••••••••••••')
    await userEvent.type(keyInput, 'testkey')
    
    const secretInput = screen.getByPlaceholderText('••••••••••••••••••••••••••••••••')
    await userEvent.type(secretInput, 'testsecret')
    
    // Submit form
    const connectBtn = screen.getByRole('button', { name: /Connect Broker/i })
    fireEvent.click(connectBtn)
    
    // UI should show connecting
    expect(await screen.findByText('Connecting...')).toBeInTheDocument()
    expect(await screen.findByText('Establishing Secure Connection')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
      expect(screen.getByText('Connection Successful!')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('Zerodha Kite', 'TESTAPP123')
      expect(mockOnClose).toHaveBeenCalled()
    }, { timeout: 4000 })
  })
})

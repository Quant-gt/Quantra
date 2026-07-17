import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RiskManagement from '../RiskManagement'
import userEvent from '@testing-library/user-event'

describe('RiskManagement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window.confirm
    window.confirm = vi.fn().mockImplementation(() => true)
  })

  it('renders default state correctly', () => {
    render(<RiskManagement />)
    
    expect(screen.getByText('Global Risk Management')).toBeInTheDocument()
    expect(screen.getByText('Max Daily Drawdown')).toBeInTheDocument()
    expect(screen.getByText('Max Open Positions')).toBeInTheDocument()
    expect(screen.getByText('5%')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10')).toBeInTheDocument() // Max positions default
  })

  it('updates max drawdown slider', () => {
    render(<RiskManagement />)
    
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '7.5' } })
    
    expect(screen.getByText('7.5%')).toBeInTheDocument()
  })

  it('updates max positions input', async () => {
    render(<RiskManagement />)
    
    const input = screen.getByDisplayValue('10')
    await userEvent.clear(input)
    await userEvent.type(input, '25')
    
    expect(input).toHaveValue(25)
  })

  it('engages global kill switch after confirmation', () => {
    render(<RiskManagement />)
    
    // Find the toggle button - since it doesn't have text, we'll grab it by looking for the closest element 
    // or by role. The easiest way is testing library's generic queries or via the icon text sibling.
    const toggleBtn = screen.getByText('Global Kill Switch').parentElement?.nextElementSibling as HTMLElement
    expect(toggleBtn).toBeInTheDocument()
    
    fireEvent.click(toggleBtn)
    
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('WARNING: Engaging the Global Kill Switch'))
    expect(screen.getByText('SYSTEM HALTED. ALL POSITIONS LIQUIDATED.')).toBeInTheDocument()
    
    // Disengage
    fireEvent.click(toggleBtn)
    expect(screen.queryByText('SYSTEM HALTED. ALL POSITIONS LIQUIDATED.')).not.toBeInTheDocument()
  })

  it('handles save state feedback', async () => {
    render(<RiskManagement />)
    
    const saveBtn = screen.getByText('Save Parameters')
    fireEvent.click(saveBtn)
    
    expect(screen.getByText('Parameters Saved')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText('Parameters Saved')).not.toBeInTheDocument()
      expect(screen.getByText('Save Parameters')).toBeInTheDocument()
    }, { timeout: 4000 })
  })
})

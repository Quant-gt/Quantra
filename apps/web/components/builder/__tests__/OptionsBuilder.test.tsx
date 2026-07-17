import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OptionsBuilder, { Instrument, Leg } from '../OptionsBuilder'
import userEvent from '@testing-library/user-event'

describe('OptionsBuilder Component', () => {
  const defaultLegs: Leg[] = [
    {
      id: 'leg-1',
      action: 'BUY',
      type: 'CALL',
      strike: 'ATM',
      expiry: 'Current',
      qty: 1
    }
  ]

  let mockSetInstrument: any
  let mockSetLegs: any

  beforeEach(() => {
    mockSetInstrument = vi.fn()
    mockSetLegs = vi.fn()
  })

  it('renders instrument selection when it is not OPTIONS', () => {
    render(
      <OptionsBuilder 
        actionType="BUY"
        instrument="EQUITY"
        setInstrument={mockSetInstrument}
        legs={defaultLegs}
        setLegs={mockSetLegs}
      />
    )
    
    // Check if instrument select is present
    expect(screen.getByRole('button', { name: 'EQUITY' })).toBeInTheDocument()
    
    // Check that legs are NOT rendered when instrument is EQUITY
    expect(screen.queryByText('Add Leg')).not.toBeInTheDocument()
  })

  it('renders option legs when instrument is OPTIONS', () => {
    render(
      <OptionsBuilder 
        actionType="BUY"
        instrument="OPTIONS"
        setInstrument={mockSetInstrument}
        legs={defaultLegs}
        setLegs={mockSetLegs}
      />
    )
    
    // Check if instrument select is present
    expect(screen.getByRole('button', { name: 'OPTIONS' })).toBeInTheDocument()
    
    // Check if leg details are rendered
    expect(screen.getByDisplayValue('CALL')).toBeInTheDocument()
    expect(screen.getByText('ATM (At the money)')).toBeInTheDocument()
    
    // Should have "Add Leg" button
    expect(screen.getByText(/Add Leg/i)).toBeInTheDocument()
  })

  it('calls setLegs when adding a new leg', () => {
    render(
      <OptionsBuilder 
        actionType="BUY"
        instrument="OPTIONS"
        setInstrument={mockSetInstrument}
        legs={defaultLegs}
        setLegs={mockSetLegs}
      />
    )
    
    const addLegBtn = screen.getByText(/Add Leg/i)
    fireEvent.click(addLegBtn)
    
    expect(mockSetLegs).toHaveBeenCalledTimes(1)
    const updatedLegs = mockSetLegs.mock.calls[0][0]
    expect(updatedLegs.length).toBe(2)
  })

  it('calls setInstrument when instrument changes', () => {
    render(
      <OptionsBuilder 
        actionType="BUY"
        instrument="EQUITY"
        setInstrument={mockSetInstrument}
        legs={defaultLegs}
        setLegs={mockSetLegs}
      />
    )
    
    const optionsBtn = screen.getByRole('button', { name: 'OPTIONS' })
    fireEvent.click(optionsBtn)
    
    expect(mockSetInstrument).toHaveBeenCalledWith('OPTIONS')
  })
})

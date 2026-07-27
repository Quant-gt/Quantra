import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SentenceBuilder, SentenceConditionBlock } from '../SentenceBuilder'
import userEvent from '@testing-library/user-event'

describe('SentenceBuilder Component', () => {
  const defaultBlocks: SentenceConditionBlock[] = [
    {
      id: 'block-1',
      offset: 'Latest',
      indicator: 'Close Price',
      comparison: 'Greater Than',
      valueType: 'Number',
      value: '100'
    },
    {
      id: 'block-2',
      offset: '1 day ago',
      indicator: 'Close Price',
      comparison: 'Less Than',
      valueType: 'Indicator',
      value: 'Close Price'
    }
  ]

  let mockOnChange: any
  let mockOnAddBlock: any
  let mockOnRemoveBlock: any

  beforeEach(() => {
    mockOnChange = vi.fn()
    mockOnAddBlock = vi.fn()
    mockOnRemoveBlock = vi.fn()
  })

  it('renders the blocks successfully', () => {
    render(
      <SentenceBuilder 
        blocks={defaultBlocks} 
        onChange={mockOnChange}
        onAddBlock={mockOnAddBlock}
        onRemoveBlock={mockOnRemoveBlock}
      />
    )
    
    // Check for selects/inputs containing our values
    expect(screen.getAllByDisplayValue('Latest')[0]).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('1 day ago')[0]).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Close Price')[0]).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Greater Than')[0]).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('100')[0]).toBeInTheDocument()
  })

  it('calls onChange when a value is updated', async () => {
    render(
      <SentenceBuilder 
        blocks={defaultBlocks} 
        onChange={mockOnChange}
        onAddBlock={mockOnAddBlock}
        onRemoveBlock={mockOnRemoveBlock}
      />
    )
    
    // Change a select value
    const offsetSelects = screen.getAllByDisplayValue('Latest')
    fireEvent.change(offsetSelects[0] as HTMLElement, { target: { value: '2 days ago' } })
    
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    
    // Check if the updated blocks are passed back
    const updatedBlocks = mockOnChange.mock.calls[0][0]
    expect(updatedBlocks[0].offset).toBe('2 days ago')
  })

  it('calls onRemoveBlock when the remove button is clicked', () => {
    render(
      <SentenceBuilder 
        blocks={defaultBlocks} 
        onChange={mockOnChange}
        onAddBlock={mockOnAddBlock}
        onRemoveBlock={mockOnRemoveBlock}
      />
    )
    
    // Find remove buttons (typically they don't have text if they are icons, but they should be buttons)
    // Since there are two blocks, there should be 2 remove buttons inside the list
    // We can rely on button role
    const buttons = screen.getAllByRole('button')
    // Click the first block's remove button
    fireEvent.click(buttons[0] as HTMLElement)
    
    expect(mockOnRemoveBlock).toHaveBeenCalledWith('block-1')
  })
})

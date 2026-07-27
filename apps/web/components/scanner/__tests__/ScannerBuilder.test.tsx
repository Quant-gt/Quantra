import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ScannerBuilder from '../ScannerBuilder'

// Mock ReactFlow to simplify testing
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow')
  return {
    ...actual,
    default: ({ children }: any) => <div data-testid="react-flow-mock">{children}</div>,
    Background: () => <div data-testid="rf-background" />,
    Controls: () => <div data-testid="rf-controls" />
  }
})

describe('ScannerBuilder Component', () => {
  const mockSetNodes = vi.fn()
  const mockSetEdges = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with initial nodes', () => {
    const initialNodes = [
      { id: '1', type: 'filter', position: { x: 0, y: 0 }, data: { category: 'Test', label: 'Test Label', condition: 'Test Condition' } }
    ]
    
    render(
      <ScannerBuilder 
        nodes={initialNodes} 
        setNodes={mockSetNodes} 
        edges={[]} 
        setEdges={mockSetEdges} 
      />
    )
    
    expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument()
    expect(screen.getByText('Add Filter Node')).toBeInTheDocument()
    expect(screen.getByText('Template Library')).toBeInTheDocument()
    expect(screen.getByText('Real-time Engine Active')).toBeInTheDocument()
  })

  it('calls setNodes when adding a new filter node', () => {
    render(
      <ScannerBuilder 
        nodes={[]} 
        setNodes={mockSetNodes} 
        edges={[]} 
        setEdges={mockSetEdges} 
      />
    )
    
    const addButton = screen.getByText('Add Filter Node')
    fireEvent.click(addButton)
    
    expect(mockSetNodes).toHaveBeenCalledTimes(1)
    
    // Simulate what the updater function does
    const updaterFn = mockSetNodes.mock.calls[0]![0]
    const currentNodes: any[] = []
    const updatedNodes = updaterFn(currentNodes)
    
    expect(updatedNodes).toHaveLength(1)
    expect(updatedNodes[0].type).toBe('filter')
    expect(updatedNodes[0].data.label).toBe('Filter 1')
  })
})

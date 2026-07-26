import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WhiteBoxViewer from '../WhiteBoxViewer';

// Mock ReactFlow since it requires ResizeObserver which is missing in jsdom
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual as any,
    default: ({ nodes, edges }: any) => (
      <div data-testid="react-flow-mock">
        <div data-testid="nodes-count">{nodes?.length || 0}</div>
        <div data-testid="edges-count">{edges?.length || 0}</div>
      </div>
    ),
    Background: () => <div data-testid="rf-background" />,
    Controls: () => <div data-testid="rf-controls" />
  };
});

describe('WhiteBoxViewer', () => {
  it('renders the react flow container', () => {
    render(<WhiteBoxViewer />);
    const flowContainer = screen.getByTestId('react-flow-mock');
    expect(flowContainer).toBeInTheDocument();
  });

  it('passes the correct number of initial nodes and edges', () => {
    render(<WhiteBoxViewer />);
    // Based on the code, initialNodes has 4 items and initialEdges has 4 items
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('4');
    expect(screen.getByTestId('edges-count')).toHaveTextContent('4');
  });
});

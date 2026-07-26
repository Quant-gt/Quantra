import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dialog } from '../dialog';

// Mock framer-motion to avoid animation delays in tests
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ children, className }: any) => React.createElement('div', { className }, children),
    },
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});

describe('Dialog Component', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Dialog open={false} onOpenChange={() => {}}>
        <div data-testid="dialog-content">Content</div>
      </Dialog>
    );
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <div data-testid="dialog-content">Content</div>
      </Dialog>
    );
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });
});

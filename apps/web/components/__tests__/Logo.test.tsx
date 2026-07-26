import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from '../Logo';

describe('Logo Component', () => {
  it('renders correctly with default class', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-8 h-8');
  });

  it('renders with custom class', () => {
    const { container } = render(<Logo className="w-12 h-12" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-12 h-12');
  });
});

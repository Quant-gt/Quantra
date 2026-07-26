import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StrategyPublishForm from '../StrategyPublishForm';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
  })),
}));

describe('StrategyPublishForm Component', () => {
  it('renders form fields correctly', () => {
    render(<StrategyPublishForm />);
    
    expect(screen.getByText(/Strategy Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategy Type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
  });

  it('shows error on invalid algo ID format', async () => {
    render(<StrategyPublishForm />);
    
    // The inputs don't have aria-labels, we get them by DOM position or associated labels
    // For simplicity, we can get the inputs by their required status since there are only two text inputs
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0]!;
    const algoInput = screen.getByPlaceholderText('NSE-STRAT-XXXXXX');
    const submitBtn = screen.getByRole('button', { name: /Register & Publish/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test Strategy' } });
    fireEvent.change(algoInput, { target: { value: 'INVALID' } });
    
    // We need to trigger submit on the form itself, or click the button. 
    // Sometimes JSDOM doesn't trigger HTML5 validation the same way.
    fireEvent.submit(submitBtn.closest('form')!);
    
    expect(await screen.findByText(/Invalid Algo-ID format/i)).toBeInTheDocument();
  });
  
  it('shows warning for black box without RA', () => {
    render(<StrategyPublishForm />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'black_box' } });
    
    expect(screen.getByText(/Warning: You must have an approved RA license/i)).toBeInTheDocument();
  });
});

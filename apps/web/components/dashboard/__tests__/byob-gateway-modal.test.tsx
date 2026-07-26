import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BYOBGatewayModal } from '../byob-gateway-modal';

// We need to mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('BYOBGatewayModal Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Reset event listeners
    const event = new Event('open-byob-modal');
    window.dispatchEvent(event);
  });

  it('opens modal if no broker configured', () => {
    render(<BYOBGatewayModal onSuccess={() => {}} />);
    expect(screen.getByText('Bring Your Own Broker (BYOB) Setup')).toBeInTheDocument();
  });

  it('renders Angel One form fields by default', () => {
    render(<BYOBGatewayModal onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText('SmartAPI Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Client ID (e.g. S12345)')).toBeInTheDocument();
  });

  it('switches to Dhan form fields when selected', () => {
    render(<BYOBGatewayModal onSuccess={() => {}} />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'dhan' } });
    
    expect(screen.getByPlaceholderText('Dhan Client ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Dhan Access Token')).toBeInTheDocument();
  });

  it('saves sandbox configuration successfully', async () => {
    const onSuccess = vi.fn();
    render(<BYOBGatewayModal onSuccess={onSuccess} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'sandbox' } });
    
    const submitBtn = screen.getByRole('button', { name: /Activate Sandbox Terminal/i });
    fireEvent.click(submitBtn);
    
    expect(window.localStorage.getItem('sigmaspire_broker_sandbox')).toBe('true');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows error when saving angel one config without required fields', async () => {
    const onSuccess = vi.fn();
    render(<BYOBGatewayModal onSuccess={onSuccess} />);
    
    const submitBtn = screen.getByRole('button', { name: /Link Active Broker & Launch Terminal/i });
    // HTML5 validation might block this in real browser, but JSDOM might let it through if we call form submission manually
    // We'll just submit the form
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);
    
    expect(await screen.findByText('All Angel One configuration fields are required.')).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

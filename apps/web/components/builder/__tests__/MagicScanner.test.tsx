import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import MagicScanner from '../MagicScanner'
import { ScreenerProvider } from '../../../context/ScreenerContext'

// Removed lucide-react mock, allowing Vitest to render real SVGs

describe('MagicScanner Component', () => {
  it('renders the component successfully', () => {
    render(
      <ScreenerProvider>
        <MagicScanner />
      </ScreenerProvider>
    )
    
    // Check for the presence of key structural elements
    expect(screen.getByText(/MAGIC FILTERS/i)).toBeInTheDocument()
    expect(screen.getByText(/Single Scan/i)).toBeInTheDocument()
  })

  it('generates synthetic scan results when "Generate & Scan" is clicked', async () => {
    // Mock global fetch for the API call
    const mockFetch = vi.fn().mockImplementation(async (url, options) => {
      return {
        ok: true,
        json: async () => ({ quotes: { HDFCBANK: { close: 1500, change: -5, rsi: 20 } } })
      };
    })
    global.fetch = mockFetch
    window.fetch = mockFetch

    render(
      <ScreenerProvider>
        <MagicScanner />
      </ScreenerProvider>
    )
    
    // Type into the first text input to enable the scan button
    const input = screen.getByPlaceholderText(/Type filters like/i)
    fireEvent.change(input, { target: { value: 'rsi oversold' } })
    
    const scanButton = screen.getByText(/Generate & Scan/i)
    expect(scanButton).toBeInTheDocument()
    expect(scanButton).not.toBeDisabled()
    
    // Click the scan button
    fireEvent.click(scanButton)
    
    // Wait for the scan to populate the table
    await waitFor(() => {
      expect(screen.getByText('HDFCBANK')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('evaluates mathematical expressions correctly', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url, options) => {
      return {
        ok: true,
        json: async () => ({ quotes: { HDFCBANK: { close: 1500, open: 1400, change: 5, rsi: 50 } } })
      };
    })
    global.fetch = mockFetch
    window.fetch = mockFetch

    render(
      <ScreenerProvider>
        <MagicScanner />
      </ScreenerProvider>
    )

    const input = screen.getByPlaceholderText(/Type filters like/i)
    fireEvent.change(input, { target: { value: 'close > open' } })
    fireEvent.click(screen.getByText(/Generate & Scan/i))

    await waitFor(() => {
      expect(screen.getByText('HDFCBANK')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('filters out stocks that do not match the mathematical expression', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url, options) => {
      return {
        ok: true,
        json: async () => ({
          quotes: {
            HDFCBANK: { close: 1400, open: 1500, change: -5, rsi: 40 },
            RELIANCE: { close: 1600, open: 1500, change: 5, rsi: 60 }
          }
        })
      };
    })
    global.fetch = mockFetch
    window.fetch = mockFetch

    render(
      <ScreenerProvider>
        <MagicScanner />
      </ScreenerProvider>
    )

    const input = screen.getByPlaceholderText(/Type filters like/i)
    fireEvent.change(input, { target: { value: 'close > open' } })
    fireEvent.click(screen.getByText(/Generate & Scan/i))

    await waitFor(() => {
      expect(screen.getByText('RELIANCE')).toBeInTheDocument()
      expect(screen.queryByText('HDFCBANK')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles invalid mathematical expressions gracefully without crashing', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url, options) => {
      return {
        ok: true,
        json: async () => ({ quotes: { HDFCBANK: { close: 1500, open: 1400, change: 5, rsi: 50 } } })
      };
    })
    global.fetch = mockFetch
    window.fetch = mockFetch

    // Spy on console.error to suppress the evaluation error output during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ScreenerProvider>
        <MagicScanner />
      </ScreenerProvider>
    )

    const input = screen.getByPlaceholderText(/Type filters like/i)
    fireEvent.change(input, { target: { value: 'close > *(' } }) // Invalid syntax
    fireEvent.click(screen.getByText(/Generate & Scan/i))

    await waitFor(() => {
      expect(screen.queryByText('HDFCBANK')).not.toBeInTheDocument()
      expect(screen.getByText(/0 results found for/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    consoleSpy.mockRestore()
  })
})

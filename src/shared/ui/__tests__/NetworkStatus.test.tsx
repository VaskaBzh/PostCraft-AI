import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NetworkStatus } from '../NetworkStatus'

describe('NetworkStatus', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { ...navigator, onLine: true })
  })

  it('renders nothing when online', () => {
    const { container } = render(<NetworkStatus />)
    expect(container.textContent).toBe('')
  })

  it('shows offline banner when offline', () => {
    vi.stubGlobal('navigator', { ...navigator, onLine: false })
    render(<NetworkStatus />)
    expect(screen.getByText(/Нет подключения/)).toBeTruthy()
  })
})

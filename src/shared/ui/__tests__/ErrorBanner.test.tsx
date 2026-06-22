import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBanner } from '../ErrorBanner'

describe('ErrorBanner', () => {
  it('renders error message', () => {
    render(<ErrorBanner type="api" message="Server error" onDismiss={() => {}} />)
    expect(screen.getByText('Server error')).toBeTruthy()
  })

  it('shows retry button when onRetry provided', () => {
    const retry = vi.fn()
    render(<ErrorBanner type="api" message="Error" onRetry={retry} onDismiss={() => {}} />)
    const btn = screen.getByText('Повторить')
    fireEvent.click(btn)
    expect(retry).toHaveBeenCalledOnce()
  })

  it('calls onDismiss when close clicked', () => {
    const dismiss = vi.fn()
    render(<ErrorBanner type="api" message="Error" onDismiss={dismiss} />)
    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[closeButtons.length - 1])
    expect(dismiss).toHaveBeenCalledOnce()
  })

  it('shows countdown for rate-limit type', () => {
    render(
      <ErrorBanner type="rate-limit" message="Too many" retryAfter={30} onDismiss={() => {}} />
    )
    expect(screen.getByText('30s')).toBeTruthy()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { ErrorBanner, parseErrorType } from '../ErrorBanner'

const messages = {
  error: {
    retry: 'Retry',
    network: 'No internet connection',
    rateLimit: 'Too many requests. Please wait.',
    forbidden: 'Access denied. Check your settings.',
    server: 'Server error. Please try again later.',
    unknown: 'Unknown error',
  },
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

const ERROR_MESSAGES = {
  network: 'No internet connection',
  rateLimit: 'Too many requests. Please wait.',
  forbidden: 'Access denied.',
  server: 'Server error.',
  unknown: 'Unknown error',
}

describe('ErrorBanner', () => {
  it('renders error message', () => {
    render(
      <Wrapper>
        <ErrorBanner type="api" message="Server error" onDismiss={() => {}} />
      </Wrapper>
    )
    expect(screen.getByText('Server error')).toBeTruthy()
  })

  it('shows retry button when onRetry provided', () => {
    const retry = vi.fn()
    render(
      <Wrapper>
        <ErrorBanner type="api" message="Error" onRetry={retry} onDismiss={() => {}} />
      </Wrapper>
    )
    const btn = screen.getByText('Retry')
    fireEvent.click(btn)
    expect(retry).toHaveBeenCalledOnce()
  })

  it('calls onDismiss when close clicked', () => {
    const dismiss = vi.fn()
    render(
      <Wrapper>
        <ErrorBanner type="api" message="Error" onDismiss={dismiss} />
      </Wrapper>
    )
    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[closeButtons.length - 1])
    expect(dismiss).toHaveBeenCalledOnce()
  })

  it('shows countdown for rate-limit type', () => {
    render(
      <Wrapper>
        <ErrorBanner type="rate-limit" message="Too many" retryAfter={30} onDismiss={() => {}} />
      </Wrapper>
    )
    expect(screen.getByText('30s')).toBeTruthy()
  })

  it('hides retry button during rate-limit countdown', () => {
    const retry = vi.fn()
    render(
      <Wrapper>
        <ErrorBanner
          type="rate-limit"
          message="Too many"
          retryAfter={10}
          onRetry={retry}
          onDismiss={() => {}}
        />
      </Wrapper>
    )
    expect(screen.queryByText('Retry')).toBeNull()
  })

  it('renders network error with correct icon styling', () => {
    render(
      <Wrapper>
        <ErrorBanner type="network" message="Offline" onDismiss={() => {}} />
      </Wrapper>
    )
    expect(screen.getByText('Offline')).toBeTruthy()
  })

  it('renders unknown error type', () => {
    render(
      <Wrapper>
        <ErrorBanner type="unknown" message="Something broke" onDismiss={() => {}} />
      </Wrapper>
    )
    expect(screen.getByText('Something broke')).toBeTruthy()
  })
})

describe('parseErrorType', () => {
  it('returns network type when offline', () => {
    vi.stubGlobal('navigator', { ...navigator, onLine: false })
    const result = parseErrorType(500, 'error', ERROR_MESSAGES)
    expect(result.type).toBe('network')
    vi.stubGlobal('navigator', { ...navigator, onLine: true })
  })

  it('returns rate-limit type for 429', () => {
    const result = parseErrorType(429, 'retry-after: 30', ERROR_MESSAGES)
    expect(result.type).toBe('rate-limit')
    expect(result.retryAfter).toBe(30)
  })

  it('returns rate-limit with default retryAfter when no header', () => {
    const result = parseErrorType(429, 'too many requests', ERROR_MESSAGES)
    expect(result.type).toBe('rate-limit')
    expect(result.retryAfter).toBe(60)
  })

  it('returns api type for 403', () => {
    const result = parseErrorType(403, 'forbidden', ERROR_MESSAGES)
    expect(result.type).toBe('api')
  })

  it('returns api type for 500+', () => {
    const result = parseErrorType(502, 'bad gateway', ERROR_MESSAGES)
    expect(result.type).toBe('api')
  })

  it('returns unknown for other statuses with message', () => {
    const result = parseErrorType(0, 'fetch failed', ERROR_MESSAGES)
    expect(result.type).toBe('unknown')
    expect(result.displayMessage).toBe('fetch failed')
  })

  it('returns fallback message when empty', () => {
    const result = parseErrorType(0, '', ERROR_MESSAGES)
    expect(result.displayMessage).toBe(ERROR_MESSAGES.unknown)
  })
})

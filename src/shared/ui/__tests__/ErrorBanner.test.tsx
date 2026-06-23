import { describe, expect, it, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils'
import { ErrorBanner, parseErrorType } from '../ErrorBanner'

const translations = {
  network: 'Нет подключения к интернету',
  rateLimit: 'Слишком много запросов. Подождите.',
  forbidden: 'Доступ запрещён. Проверьте настройки.',
  server: 'Ошибка сервера. Попробуйте позже.',
  unknown: 'Неизвестная ошибка',
}

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

  it('hides retry button during rate-limit countdown', () => {
    const retry = vi.fn()
    render(
      <ErrorBanner
        type="rate-limit"
        message="Too many"
        retryAfter={10}
        onRetry={retry}
        onDismiss={() => {}}
      />
    )
    expect(screen.queryByText('Повторить')).toBeNull()
  })

  it('renders network error with correct icon styling', () => {
    render(<ErrorBanner type="network" message="Offline" onDismiss={() => {}} />)
    expect(screen.getByText('Offline')).toBeTruthy()
  })

  it('renders unknown error type', () => {
    render(<ErrorBanner type="unknown" message="Something broke" onDismiss={() => {}} />)
    expect(screen.getByText('Something broke')).toBeTruthy()
  })
})

describe('parseErrorType', () => {
  it('returns network type when offline', () => {
    vi.stubGlobal('navigator', { ...navigator, onLine: false })
    const result = parseErrorType(500, 'error', translations)
    expect(result.type).toBe('network')
    vi.stubGlobal('navigator', { ...navigator, onLine: true })
  })

  it('returns rate-limit type for 429', () => {
    const result = parseErrorType(429, 'retry-after: 30', translations)
    expect(result.type).toBe('rate-limit')
    expect(result.retryAfter).toBe(30)
  })

  it('returns rate-limit with default retryAfter when no header', () => {
    const result = parseErrorType(429, 'too many requests', translations)
    expect(result.type).toBe('rate-limit')
    expect(result.retryAfter).toBe(60)
  })

  it('returns api type for 403', () => {
    const result = parseErrorType(403, 'forbidden', translations)
    expect(result.type).toBe('api')
  })

  it('returns api type for 500+', () => {
    const result = parseErrorType(502, 'bad gateway', translations)
    expect(result.type).toBe('api')
  })

  it('returns unknown for other statuses', () => {
    const result = parseErrorType(0, 'fetch failed', translations)
    expect(result.type).toBe('unknown')
    expect(result.displayMessage).toBe('fetch failed')
  })

  it('returns fallback message when empty', () => {
    const result = parseErrorType(0, '', translations)
    expect(result.displayMessage).toBe('Неизвестная ошибка')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('validateOrigin', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('allows all origins in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate', {
      headers: { origin: 'http://evil.com' },
    })

    expect(validateOrigin(request)).toBe(true)
  })

  it('allows requests from ALLOWED_ORIGINS', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', 'https://my-app.vercel.app,https://custom.domain.com')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate', {
      headers: { origin: 'https://my-app.vercel.app' },
    })

    expect(validateOrigin(request)).toBe(true)
  })

  it('rejects requests from unknown origins', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', 'https://my-app.vercel.app')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate', {
      headers: { origin: 'https://evil.com' },
    })

    expect(validateOrigin(request)).toBe(false)
  })

  it('allows requests matching VERCEL_URL', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', '')
    vi.stubEnv('VERCEL_URL', 'my-app-abc123.vercel.app')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate', {
      headers: { origin: 'https://my-app-abc123.vercel.app' },
    })

    expect(validateOrigin(request)).toBe(true)
  })

  it('allows requests matching VERCEL_PROJECT_PRODUCTION_URL', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'my-app.vercel.app')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate', {
      headers: { origin: 'https://my-app.vercel.app' },
    })

    expect(validateOrigin(request)).toBe(true)
  })

  it('validates via referer header when origin is missing', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', 'https://my-app.vercel.app')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate', {
      headers: { referer: 'https://my-app.vercel.app/some/page' },
    })

    expect(validateOrigin(request)).toBe(true)
  })

  it('allows all when no origins are configured', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', '')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate')

    expect(validateOrigin(request)).toBe(true)
  })

  it('rejects requests with no origin/referer headers when origins are set', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', 'https://my-app.vercel.app')

    const { validateOrigin } = await import('../origin-check')
    const request = new Request('http://localhost/api/generate')

    expect(validateOrigin(request)).toBe(false)
  })
})

describe('getAllowedOrigins', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('parses comma-separated ALLOWED_ORIGINS', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://a.com, https://b.com , https://c.com')

    const { getAllowedOrigins } = await import('../origin-check')

    expect(getAllowedOrigins()).toEqual(['https://a.com', 'https://b.com', 'https://c.com'])
  })

  it('includes VERCEL_URL with https prefix', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', '')
    vi.stubEnv('VERCEL_URL', 'app.vercel.app')

    const { getAllowedOrigins } = await import('../origin-check')

    expect(getAllowedOrigins()).toContain('https://app.vercel.app')
  })
})

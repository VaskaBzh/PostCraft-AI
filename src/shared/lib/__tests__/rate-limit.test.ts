import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockLimit = vi.fn()

vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {},
}))

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class MockRatelimit {
    static slidingWindow() {
      return 'sliding-window-config'
    }

    limit = mockLimit
  },
}))

describe('rate-limit', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('allows all requests when Upstash env vars are missing', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    vi.stubEnv('NODE_ENV', 'development')

    const { rateLimit } = await import('../rate-limit')
    const request = new Request('http://localhost/api/generate', { method: 'POST' })

    const result = await rateLimit(request)

    expect(result.success).toBe(true)
    expect(result.remaining).toBe(10)
  })

  it('returns rate limit result from Upstash when configured', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')

    mockLimit.mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    })

    const { rateLimit } = await import('../rate-limit')
    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
    })

    const result = await rateLimit(request)

    expect(result.success).toBe(true)
    expect(result.remaining).toBe(9)
    expect(mockLimit).toHaveBeenCalledWith('1.2.3.4')
  })

  it('returns failure when rate limit exceeded', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')

    mockLimit.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 30000,
    })

    const { rateLimit } = await import('../rate-limit')
    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'x-forwarded-for': '5.6.7.8' },
    })

    const result = await rateLimit(request)

    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })
})

describe('getClientIp', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('extracts IP from x-forwarded-for header', async () => {
    const { getClientIp } = await import('../rate-limit')
    const request = new Request('http://localhost/', {
      headers: { 'x-forwarded-for': '10.0.0.1, 10.0.0.2' },
    })

    expect(getClientIp(request)).toBe('10.0.0.1')
  })

  it('falls back to x-real-ip header', async () => {
    const { getClientIp } = await import('../rate-limit')
    const request = new Request('http://localhost/', {
      headers: { 'x-real-ip': '192.168.1.1' },
    })

    expect(getClientIp(request)).toBe('192.168.1.1')
  })

  it('returns 127.0.0.1 when no IP headers present', async () => {
    const { getClientIp } = await import('../rate-limit')
    const request = new Request('http://localhost/')

    expect(getClientIp(request)).toBe('127.0.0.1')
  })
})

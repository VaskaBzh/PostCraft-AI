import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return '127.0.0.1'
}

let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'postcraft-rl',
  })

  return ratelimit
}

export async function rateLimit(request: Request): Promise<RateLimitResult> {
  const limiter = getRatelimit()

  if (!limiter) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[rate-limit] Upstash not configured, allowing all requests (dev mode)')
    }
    return { success: true, limit: 10, remaining: 10, reset: 0 }
  }

  const ip = getClientIp(request)
  const { success, limit, remaining, reset } = await limiter.limit(ip)

  return { success, limit, remaining, reset }
}

export { getClientIp }

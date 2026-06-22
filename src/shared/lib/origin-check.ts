function getAllowedOrigins(): string[] {
  const origins: string[] = []

  const envOrigins = process.env.ALLOWED_ORIGINS
  if (envOrigins) {
    for (const o of envOrigins.split(',')) {
      const trimmed = o.trim()
      if (trimmed) origins.push(trimmed)
    }
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    origins.push(`https://${vercelUrl}`)
  }

  const vercelProjectUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProjectUrl) {
    origins.push(`https://${vercelProjectUrl}`)
  }

  return origins
}

export function validateOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const allowed = getAllowedOrigins()
  if (allowed.length === 0) {
    return true
  }

  const origin = request.headers.get('origin')
  if (origin && allowed.includes(origin)) {
    return true
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (allowed.includes(refererOrigin)) {
        return true
      }
    } catch {
      // malformed referer
    }
  }

  return false
}

export { getAllowedOrigins }

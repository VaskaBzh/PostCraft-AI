[← ADR Index](README.md)

# ADR-001: Next.js App Router over Vite SPA

**Date:** 2025-01-01
**Status:** Accepted

## Context

The original implementation was a Vite + React SPA that called the Anthropic SDK directly from a browser hook (`useStreamingGenerate`). This required setting `dangerouslyAllowBrowser: true` in the SDK constructor to suppress the security warning:

```typescript
// Original approach — API key exposed in the browser bundle
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // explicit security bypass
})
```

This meant the API key was embedded in the JavaScript bundle served to the browser, creating a risk of key extraction by any visitor. The flag name itself communicates that this is an unsafe pattern.

## Decision

Migrate from Vite SPA to **Next.js App Router** with a server-side Route Handler for all Anthropic API calls.

The Route Handler (`app/api/generate/route.ts`) runs exclusively on the server. It reads `ANTHROPIC_API_KEY` from `process.env` — a server environment variable that never reaches the browser. The browser sends a `POST /api/generate` request and receives a `ReadableStream` of text chunks.

```typescript
// Route Handler — server-side only
export async function POST(req: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // ...
}
```

## Consequences

**Better:**

- API key is never in the browser bundle or network responses
- `dangerouslyAllowBrowser: true` is eliminated entirely
- Server Components (RSC) are available for future use
- Streaming via `ReadableStream` works natively in Next.js Route Handlers

**Worse / constrained:**

- Local development requires a `.env.local` file with `ANTHROPIC_API_KEY`
- CI/CD pipelines need the key as a secret (`ANTHROPIC_API_KEY` in GitHub Actions)
- The client hook (`useStreamingGenerate`) now reads a `Response` stream instead of an SDK event emitter — slightly different iteration pattern

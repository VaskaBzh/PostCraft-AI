import { describe, it, expect } from 'vitest'
import { estimateTokens, topEntries, initialAnalyticsState } from './analytics'

describe('estimateTokens', () => {
  it('returns 0 for empty string', () => {
    expect(estimateTokens(0)).toBe(0)
  })

  it('estimates tokens at ~4 chars per token', () => {
    expect(estimateTokens(100)).toBe(25)
    expect(estimateTokens(280)).toBe(70)
  })

  it('rounds up partial tokens', () => {
    expect(estimateTokens(1)).toBe(1)
    expect(estimateTokens(5)).toBe(2)
    expect(estimateTokens(7)).toBe(2)
  })
})

describe('topEntries', () => {
  it('returns top N entries sorted by count descending', () => {
    const record = { a: 5, b: 10, c: 3, d: 8 }
    const result = topEntries(record, 2)
    expect(result).toEqual([
      { key: 'b', count: 10 },
      { key: 'd', count: 8 },
    ])
  })

  it('filters out zero-count entries', () => {
    const record = { a: 5, b: 0, c: 0 }
    const result = topEntries(record, 3)
    expect(result).toEqual([{ key: 'a', count: 5 }])
  })

  it('returns empty array for all-zero data', () => {
    const record = { a: 0, b: 0 }
    expect(topEntries(record)).toEqual([])
  })

  it('defaults to top 3', () => {
    const record = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    expect(topEntries(record)).toHaveLength(3)
  })
})

describe('initialAnalyticsState', () => {
  it('starts with all counters at zero', () => {
    expect(initialAnalyticsState.totalGenerations).toBe(0)
    expect(initialAnalyticsState.totalTokensEstimate).toBe(0)
  })

  it('has all platform keys initialized', () => {
    const platforms = ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'telegram']
    for (const p of platforms) {
      expect(initialAnalyticsState.byPlatform).toHaveProperty(p, 0)
    }
  })

  it('has all tone keys initialized', () => {
    const tones = ['professional', 'casual', 'humorous', 'inspirational', 'bold']
    for (const t of tones) {
      expect(initialAnalyticsState.byTone).toHaveProperty(t, 0)
    }
  })

  it('has all model keys initialized', () => {
    const models = ['claude-haiku-4-5', 'claude-sonnet-4-6', 'claude-opus-4-8']
    for (const m of models) {
      expect(initialAnalyticsState.byModel).toHaveProperty(m, 0)
    }
  })
})

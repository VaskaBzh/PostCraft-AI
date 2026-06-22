'use client'

import type { Platform, Tone, ModelId } from '@/entities/platform/types'

export interface AnalyticsState {
  totalGenerations: number
  byPlatform: Record<Platform, number>
  byTone: Record<Tone, number>
  byModel: Record<ModelId, number>
  totalTokensEstimate: number
}

export interface AnalyticsActions {
  trackGeneration: (platform: Platform, tone: Tone, model: ModelId, charCount: number) => void
  resetAnalytics: () => void
}

export type AnalyticsSlice = AnalyticsState & AnalyticsActions

const CHARS_PER_TOKEN = 4

export function estimateTokens(charCount: number): number {
  return Math.ceil(charCount / CHARS_PER_TOKEN)
}

export const initialAnalyticsState: AnalyticsState = {
  totalGenerations: 0,
  byPlatform: {
    twitter: 0,
    instagram: 0,
    linkedin: 0,
    facebook: 0,
    tiktok: 0,
    telegram: 0,
  },
  byTone: {
    professional: 0,
    casual: 0,
    humorous: 0,
    inspirational: 0,
    bold: 0,
  },
  byModel: {
    'claude-haiku-4-5': 0,
    'claude-sonnet-4-6': 0,
    'claude-opus-4-8': 0,
  },
  totalTokensEstimate: 0,
}

export function topEntries<K extends string>(
  record: Record<K, number>,
  limit = 3
): { key: K; count: number }[] {
  return (Object.entries(record) as [K, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({ key, count }))
}

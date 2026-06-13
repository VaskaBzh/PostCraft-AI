'use client'

import { useState, useRef, useCallback } from 'react'
import { useStore } from '@/shared/model/store'
import type { Platform } from '@/entities/platform/types'

export type PlatformStatus = 'idle' | 'streaming' | 'done' | 'error'

export interface PlatformResult {
  status: PlatformStatus
  text: string
  error?: string
}

export type BulkResults = Partial<Record<Platform, PlatformResult>>

export function useBulkGenerate() {
  const [results, setResults] = useState<BulkResults>({})
  const [isRunning, setIsRunning] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const { settings, selectedModel } = useStore()

  const updateResult = useCallback((platform: Platform, patch: Partial<PlatformResult>) => {
    setResults((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], ...patch } as PlatformResult,
    }))
  }, [])

  const generate = useCallback(async (prompt: string, platforms: Platform[]) => {
    if (!prompt.trim() || platforms.length === 0) return

    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    const initial: BulkResults = {}
    for (const p of platforms) initial[p] = { status: 'streaming', text: '' }
    setResults(initial)
    setIsRunning(true)

    await Promise.allSettled(
      platforms.map(async (platform) => {
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal,
            body: JSON.stringify({
              prompt,
              model: selectedModel,
              settings: { ...settings, platform },
            }),
          })

          if (!response.ok || !response.body) {
            throw new Error(`HTTP ${response.status}`)
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let text = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            text += decoder.decode(value, { stream: true })
            updateResult(platform, { text })
          }

          updateResult(platform, { status: 'done', text })
        } catch (err) {
          if (signal.aborted) {
            updateResult(platform, { status: 'idle', text: '' })
            return
          }
          const msg = err instanceof Error ? err.message : 'Ошибка'
          console.warn('[bulk] error on platform:', platform, err)
          updateResult(platform, { status: 'error', error: msg })
        }
      })
    )

    setIsRunning(false)
  }, [settings, selectedModel, updateResult])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setResults({})
  }, [])

  return { results, isRunning, generate, stop, reset }
}

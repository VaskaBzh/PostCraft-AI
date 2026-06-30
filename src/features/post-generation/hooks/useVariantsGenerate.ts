'use client'

import { useState, useCallback } from 'react'
import { useStore } from '@/shared/model/store'

export type VariantStyle = 'standard' | 'concise' | 'creative'

export interface VariantState {
  content: string
  isStreaming: boolean
  error: string | null
}

const EMPTY_VARIANT: VariantState = { content: '', isStreaming: false, error: null }

const VARIANT_SUFFIX: Record<VariantStyle, string> = {
  standard: '',
  concise:
    '\n\n[Style constraint: Be maximally concise and punchy. Every single word must earn its place.]',
  creative:
    '\n\n[Style constraint: Use an unexpected, unconventional angle that will genuinely surprise the reader.]',
}

export const VARIANT_STYLES: VariantStyle[] = ['standard', 'concise', 'creative']

type VariantsMap = Record<VariantStyle, VariantState>

export function useVariantsGenerate() {
  const { settings, selectedModel } = useStore()
  const [variants, setVariants] = useState<VariantsMap>({
    standard: { ...EMPTY_VARIANT },
    concise: { ...EMPTY_VARIANT },
    creative: { ...EMPTY_VARIANT },
  })
  const [isRunning, setIsRunning] = useState(false)

  const patchVariant = useCallback((style: VariantStyle, patch: Partial<VariantState>) => {
    setVariants((prev) => ({ ...prev, [style]: { ...prev[style], ...patch } }))
  }, [])

  const streamOne = useCallback(
    async (style: VariantStyle, prompt: string) => {
      patchVariant(style, { content: '', isStreaming: true, error: null })
      const body = JSON.stringify({
        prompt: `${prompt}${VARIANT_SUFFIX[style]}`,
        settings,
        model: selectedModel,
      })

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })

        if (!res.ok || !res.body) {
          patchVariant(style, { isStreaming: false, error: `Error ${res.status}` })
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let text = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          text += decoder.decode(value, { stream: true })
          patchVariant(style, { content: text })
        }

        patchVariant(style, { content: text, isStreaming: false })
      } catch {
        patchVariant(style, { isStreaming: false, error: 'Network error' })
      }
    },
    [settings, selectedModel, patchVariant]
  )

  const generate = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isRunning) return
      setIsRunning(true)
      await Promise.all(VARIANT_STYLES.map((style) => streamOne(style, prompt)))
      setIsRunning(false)
    },
    [isRunning, streamOne]
  )

  const reset = useCallback(() => {
    setVariants({
      standard: { ...EMPTY_VARIANT },
      concise: { ...EMPTY_VARIANT },
      creative: { ...EMPTY_VARIANT },
    })
  }, [])

  return { variants, isRunning, generate, reset }
}

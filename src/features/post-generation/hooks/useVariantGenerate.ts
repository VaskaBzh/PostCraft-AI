'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'

export interface VariantResult {
  id: string
  content: string
  tone: string
  isStreaming: boolean
}

const VARIANT_TONES = ['professional', 'casual', 'humorous'] as const

export function useVariantGenerate() {
  const { settings, selectedModel, trackGeneration } = useStore()
  const [variants, setVariants] = useState<VariantResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const isGeneratingRef = useRef(false)
  const tTones = useTranslations('tones')

  const generateVariants = useCallback(
    async (prompt: string, count = 3) => {
      if (!prompt.trim() || isGeneratingRef.current) return

      isGeneratingRef.current = true
      setIsGenerating(true)
      const groupId = crypto.randomUUID()
      const tones = VARIANT_TONES.slice(0, count)

      const initial: VariantResult[] = tones.map((tone, i) => ({
        id: `${groupId}-${i}`,
        content: '',
        tone,
        isStreaming: true,
      }))
      setVariants(initial)

      for (let i = 0; i < tones.length; i++) {
        const tone = tones[i]

        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              model: selectedModel,
              settings: { ...settings, tone },
            }),
          })

          if (!response.ok || !response.body) {
            setVariants((prev) =>
              prev.map((v, idx) =>
                idx === i
                  ? { ...v, content: `Error: HTTP ${response.status}`, isStreaming: false }
                  : v
              )
            )
            continue
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let text = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            text += decoder.decode(value, { stream: true })

            setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, content: text } : v)))
          }

          setVariants((prev) =>
            prev.map((v, idx) => (idx === i ? { ...v, content: text, isStreaming: false } : v))
          )

          trackGeneration(settings.platform, tone, selectedModel, text.length)
        } catch (err) {
          console.error(`[variants] error for tone ${tone}:`, err)
          setVariants((prev) =>
            prev.map((v, idx) =>
              idx === i
                ? {
                    ...v,
                    content: err instanceof Error ? err.message : 'Error',
                    isStreaming: false,
                  }
                : v
            )
          )
        }
      }

      isGeneratingRef.current = false
      setIsGenerating(false)
    },
    [settings, selectedModel, trackGeneration]
  )

  const clearVariants = useCallback(() => {
    setVariants([])
  }, [])

  return {
    variants,
    isGenerating,
    generateVariants,
    clearVariants,
    toneLabel: (t: string) => tTones(t),
  }
}

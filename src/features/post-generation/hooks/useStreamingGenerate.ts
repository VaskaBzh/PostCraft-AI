'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'
import type { ErrorType } from '@/shared/ui/ErrorBanner'
import { parseErrorType } from '@/shared/ui/ErrorBanner'

interface StreamError {
  type: ErrorType
  message: string
  retryAfter?: number
}

export function useStreamingGenerate() {
  const { settings, selectedModel, addMessage, updateLastMessage, setGenerating, trackGeneration } =
    useStore()
  const [error, setError] = useState<StreamError | null>(null)
  const lastPromptRef = useRef<string>('')
  const tError = useTranslations('error')
  const tErrorRef = useRef(tError)
  useEffect(() => {
    tErrorRef.current = tError
  }, [tError])

  const generate = useCallback(
    async (userPrompt: string) => {
      if (!userPrompt.trim()) return

      const errorTranslations = {
        network: tErrorRef.current('network'),
        rateLimit: tErrorRef.current('rateLimit'),
        forbidden: tErrorRef.current('forbidden'),
        server: tErrorRef.current('server'),
        unknown: tErrorRef.current('unknown'),
      }

      lastPromptRef.current = userPrompt
      setError(null)

      const { platform, tone } = settings

      const userMsg = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: userPrompt,
        platform,
        tone,
        timestamp: new Date(),
      }
      addMessage(userMsg)

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: '',
        platform,
        tone,
        timestamp: new Date(),
        isStreaming: true,
      }
      addMessage(assistantMsg)
      setGenerating(true)

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userPrompt, settings, model: selectedModel }),
        })

        if (!response.ok || !response.body) {
          const body = await response.text().catch(() => '')
          const parsed = parseErrorType(response.status, body, errorTranslations)
          setError({
            type: parsed.type,
            message: parsed.displayMessage,
            retryAfter: parsed.retryAfter,
          })
          updateLastMessage(`${parsed.displayMessage}`, true)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
          updateLastMessage(fullText)
        }

        updateLastMessage(fullText, true)
        trackGeneration(platform, tone, selectedModel, fullText.length)
      } catch (err) {
        console.error('[generate] fetch error:', err)
        const parsed = parseErrorType(0, err instanceof Error ? err.message : '', errorTranslations)
        setError({
          type: parsed.type,
          message: parsed.displayMessage,
          retryAfter: parsed.retryAfter,
        })
        updateLastMessage(`${parsed.displayMessage}`, true)
      } finally {
        setGenerating(false)
      }
    },
    [settings, selectedModel, addMessage, updateLastMessage, setGenerating, trackGeneration]
  )

  const retry = useCallback(() => {
    if (lastPromptRef.current) {
      generate(lastPromptRef.current)
    }
  }, [generate])

  const dismissError = useCallback(() => {
    setError(null)
  }, [])

  return { generate, error, retry, dismissError }
}

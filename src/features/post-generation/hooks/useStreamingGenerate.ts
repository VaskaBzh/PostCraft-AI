'use client'

import { useState, useRef, useCallback } from 'react'
import { useStore } from '@/shared/model/store'
import type { ErrorType } from '@/shared/ui/ErrorBanner'
import { parseErrorType } from '@/shared/ui/ErrorBanner'

interface StreamError {
  type: ErrorType
  message: string
  retryAfter?: number
}

export function useStreamingGenerate() {
  const { settings, selectedModel, addMessage, updateLastMessage, setGenerating } = useStore()
  const [error, setError] = useState<StreamError | null>(null)
  const lastPromptRef = useRef<string>('')

  const generate = useCallback(
    async (userPrompt: string) => {
      if (!userPrompt.trim()) return

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
          const parsed = parseErrorType(response.status, body)
          setError({
            type: parsed.type,
            message: parsed.displayMessage,
            retryAfter: parsed.retryAfter,
          })
          updateLastMessage(`❌ ${parsed.displayMessage}`, true)
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
      } catch (err) {
        console.error('[generate] fetch error:', err)
        const parsed = parseErrorType(0, err instanceof Error ? err.message : '')
        setError({
          type: parsed.type,
          message: parsed.displayMessage,
          retryAfter: parsed.retryAfter,
        })
        updateLastMessage(`❌ ${parsed.displayMessage}`, true)
      } finally {
        setGenerating(false)
      }
    },
    [settings, selectedModel, addMessage, updateLastMessage, setGenerating]
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

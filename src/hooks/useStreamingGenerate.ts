'use client'

import { useStore } from '../store/useStore'

export function useStreamingGenerate() {
  const { settings, addMessage, updateLastMessage, setGenerating } = useStore()

  const generate = async (userPrompt: string) => {
    if (!userPrompt.trim()) return

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

    console.log('[generate] request sent, settings:', settings)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, settings }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`)
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
      console.log('[generate] stream complete')
    } catch (err) {
      console.error('[generate] fetch error:', err)
      const errMsg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      updateLastMessage(`❌ Ошибка: ${errMsg}`, true)
    } finally {
      setGenerating(false)
    }
  }

  return { generate }
}

import { renderHook, act, waitFor } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import { useStore } from '@/shared/model/store'
import { initialAnalyticsState } from '@/shared/model/analytics'
import messages from '../../../../messages/ru.json'
import { useStreamingGenerate } from './useStreamingGenerate'

function makeStream(chunks: string[]) {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  })
}

function wrapper({ children }: { children: React.ReactNode }) {
  return createElement(NextIntlClientProvider, { locale: 'ru', messages, children })
}

beforeEach(() => {
  vi.restoreAllMocks()
  useStore.setState({
    messages: [],
    isGenerating: false,
    selectedModel: 'claude-sonnet-4-6',
    templates: [],
    pendingPrompt: null,
    settings: {
      platform: 'instagram',
      tone: 'casual',
      length: 'medium',
      includeHashtags: true,
      includeEmojis: true,
      language: 'Русский',
    },
    ...initialAnalyticsState,
  })
})

describe('useStreamingGenerate', () => {
  it('returns a generate function', () => {
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    expect(typeof result.current.generate).toBe('function')
  })

  it('does nothing when prompt is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    await act(() => result.current.generate('   '))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('adds user and assistant messages on generate', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['Hello', ' world']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    await act(() => result.current.generate('Tell me about AI'))

    const msgs = useStore.getState().messages
    expect(msgs).toHaveLength(2)
    expect(msgs[0].role).toBe('user')
    expect(msgs[0].content).toBe('Tell me about AI')
    expect(msgs[1].role).toBe('assistant')
  })

  it('accumulates streamed content into assistant message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['Hello', ' world']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    await act(() => result.current.generate('prompt'))

    await waitFor(() => {
      const last = useStore.getState().messages.at(-1)
      expect(last?.content).toBe('Hello world')
      expect(last?.isStreaming).toBe(false)
    })
  })

  it('tracks generation on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['Hello world']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    await act(() => result.current.generate('prompt'))

    expect(useStore.getState().totalGenerations).toBe(1)
    expect(useStore.getState().byPlatform.instagram).toBe(1)
  })

  it('sets error on HTTP failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    await act(() => result.current.generate('prompt'))

    expect(result.current.error).not.toBeNull()
    expect(result.current.error?.type).toBe('api')
  })

  it('sets generating to false after completion', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['ok']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate(), { wrapper })
    await act(() => result.current.generate('prompt'))
    expect(useStore.getState().isGenerating).toBe(false)
  })
})

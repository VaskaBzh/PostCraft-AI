import { renderHook, act, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from '@/shared/model/store'
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
  })
})

describe('useStreamingGenerate', () => {
  it('returns a generate function', () => {
    const { result } = renderHook(() => useStreamingGenerate())
    expect(typeof result.current.generate).toBe('function')
  })

  it('does nothing when prompt is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useStreamingGenerate())
    await act(() => result.current.generate('   '))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('adds user and assistant messages on generate', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['Hello', ' world']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate())
    await act(() => result.current.generate('Tell me about AI'))

    const messages = useStore.getState().messages
    expect(messages).toHaveLength(2)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toBe('Tell me about AI')
    expect(messages[1].role).toBe('assistant')
  })

  it('accumulates streamed content into assistant message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['Hello', ' world']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate())
    await act(() => result.current.generate('prompt'))

    await waitFor(() => {
      const last = useStore.getState().messages.at(-1)
      expect(last?.content).toBe('Hello world')
      expect(last?.isStreaming).toBe(false)
    })
  })

  it('sets error message on HTTP failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const { result } = renderHook(() => useStreamingGenerate())
    await act(() => result.current.generate('prompt'))

    const last = useStore.getState().messages.at(-1)
    expect(last?.content).toMatch(/❌ Ошибка/)
    expect(last?.isStreaming).toBe(false)
  })

  it('sets generating to false after completion', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream(['ok']), { status: 200 })
    )
    const { result } = renderHook(() => useStreamingGenerate())
    await act(() => result.current.generate('prompt'))
    expect(useStore.getState().isGenerating).toBe(false)
  })
})

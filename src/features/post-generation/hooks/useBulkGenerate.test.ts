import { renderHook, act, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from '@/shared/model/store'
import { useBulkGenerate } from './useBulkGenerate'

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

describe('useBulkGenerate', () => {
  it('has correct initial state', () => {
    const { result } = renderHook(() => useBulkGenerate())
    expect(result.current.results).toEqual({})
    expect(result.current.isRunning).toBe(false)
  })

  it('does nothing when prompt is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('', ['instagram', 'twitter']))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does nothing when platforms list is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('prompt', []))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('generates for multiple platforms in parallel', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(makeStream(['text']), { status: 200 }))
    )
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('prompt', ['instagram', 'twitter']))

    await waitFor(() => {
      expect(result.current.results['instagram']?.status).toBe('done')
      expect(result.current.results['twitter']?.status).toBe('done')
    })
  })

  it('accumulates text per platform on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(makeStream(['Hello', ' world']), { status: 200 }))
    )
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('prompt', ['linkedin']))

    await waitFor(() => {
      expect(result.current.results['linkedin']?.text).toBe('Hello world')
      expect(result.current.results['linkedin']?.status).toBe('done')
    })
  })

  it('sets error status on HTTP failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('prompt', ['facebook']))

    await waitFor(() => {
      expect(result.current.results['facebook']?.status).toBe('error')
    })
  })

  it('sets isRunning to false after completion', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(makeStream(['ok']), { status: 200 }))
    )
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('prompt', ['instagram']))
    expect(result.current.isRunning).toBe(false)
  })

  it('reset clears results', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(makeStream(['ok']), { status: 200 }))
    )
    const { result } = renderHook(() => useBulkGenerate())
    await act(() => result.current.generate('prompt', ['twitter']))
    act(() => result.current.reset())
    expect(result.current.results).toEqual({})
  })
})

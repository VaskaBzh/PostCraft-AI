import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVariantsGenerate, VARIANT_STYLES } from './useVariantsGenerate'

function makeStream(text: string) {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text))
      controller.close()
    },
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useVariantsGenerate', () => {
  it('initialises all variants as empty and not streaming', () => {
    const { result } = renderHook(() => useVariantsGenerate())
    for (const style of VARIANT_STYLES) {
      expect(result.current.variants[style].content).toBe('')
      expect(result.current.variants[style].isStreaming).toBe(false)
      expect(result.current.variants[style].error).toBeNull()
    }
  })

  it('reset clears all variant content', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(makeStream('hello'), { status: 200 })
    )
    const { result } = renderHook(() => useVariantsGenerate())

    await act(async () => {
      await result.current.generate('topic')
    })
    act(() => result.current.reset())

    for (const style of VARIANT_STYLES) {
      expect(result.current.variants[style].content).toBe('')
    }
  })

  it('sets error when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useVariantsGenerate())

    await act(async () => {
      await result.current.generate('topic')
    })

    for (const style of VARIANT_STYLES) {
      expect(result.current.variants[style].error).not.toBeNull()
      expect(result.current.variants[style].isStreaming).toBe(false)
    }
  })
})

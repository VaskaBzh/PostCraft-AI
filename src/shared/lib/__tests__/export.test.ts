import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Message } from '@/entities/platform/types'
import { formatAsMarkdown, formatAsPlainText, copyToClipboard, downloadAsFile } from '../export'

const msg: Message = {
  id: '1',
  role: 'assistant',
  content: 'Hello world',
  platform: 'twitter',
  tone: 'casual',
  timestamp: new Date('2026-06-22T12:00:00Z'),
}

describe('formatAsMarkdown', () => {
  it('includes platform, tone, and content', () => {
    const result = formatAsMarkdown(msg)
    expect(result).toContain('**Platform:** twitter')
    expect(result).toContain('**Tone:** casual')
    expect(result).toContain('Hello world')
    expect(result).toContain('---')
  })
})

describe('formatAsPlainText', () => {
  it('returns raw content', () => {
    expect(formatAsPlainText(msg)).toBe('Hello world')
  })
})

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const result = await copyToClipboard('test')
    expect(result).toBe(true)
    expect(writeText).toHaveBeenCalledWith('test')
  })

  it('falls back to execCommand when clipboard API fails', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })

    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand

    const result = await copyToClipboard('fallback text')
    expect(result).toBe(true)
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('falls back to execCommand when clipboard API missing', async () => {
    Object.assign(navigator, { clipboard: undefined })

    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand

    const result = await copyToClipboard('no clipboard')
    expect(result).toBe(true)
  })

  it('returns false when all methods fail', async () => {
    Object.assign(navigator, { clipboard: undefined })
    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('not supported')
    })

    const result = await copyToClipboard('fail')
    expect(result).toBe(false)
  })
})

describe('downloadAsFile', () => {
  it('creates blob URL and triggers download', () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:test')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL

    const click = vi.fn()
    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLAnchorElement) {
        vi.spyOn(node, 'click').mockImplementation(click)
      }
      return node
    })
    const removeChild = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

    downloadAsFile('content', 'test.txt')

    expect(createObjectURL).toHaveBeenCalled()
    expect(appendChild).toHaveBeenCalled()
    expect(removeChild).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test')
  })
})

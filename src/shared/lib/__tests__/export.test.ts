import { describe, expect, it, vi } from 'vitest'
import type { Message } from '@/entities/platform/types'
import { formatAsMarkdown, formatAsPlainText, copyToClipboard } from '../export'

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
  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const result = await copyToClipboard('test')
    expect(result).toBe(true)
    expect(writeText).toHaveBeenCalledWith('test')
  })
})

import { describe, expect, it } from 'vitest'
import { importHistory } from '../history-io'

function makeFile(content: string): File {
  return new File([content], 'test.json', { type: 'application/json' })
}

describe('importHistory', () => {
  it('parses valid message array', async () => {
    const data = [
      {
        id: '1',
        role: 'user',
        content: 'hello',
        platform: 'twitter',
        tone: 'casual',
        timestamp: '2026-06-22T12:00:00Z',
      },
    ]
    const file = makeFile(JSON.stringify(data))
    const result = await importHistory(file)
    expect(result).toHaveLength(1)
    expect(result[0].role).toBe('user')
    expect(result[0].timestamp).toBeInstanceOf(Date)
  })

  it('rejects non-array input', async () => {
    const file = makeFile(JSON.stringify({ not: 'array' }))
    await expect(importHistory(file)).rejects.toThrow('expected an array')
  })

  it('rejects invalid message shape', async () => {
    const file = makeFile(JSON.stringify([{ id: '1', role: 'invalid' }]))
    await expect(importHistory(file)).rejects.toThrow('Invalid message at index 0')
  })

  it('rejects invalid platform', async () => {
    const data = [
      {
        id: '1',
        role: 'user',
        content: 'hi',
        platform: 'myspace',
        tone: 'casual',
        timestamp: '2026-01-01',
      },
    ]
    const file = makeFile(JSON.stringify(data))
    await expect(importHistory(file)).rejects.toThrow('Invalid message at index 0')
  })
})

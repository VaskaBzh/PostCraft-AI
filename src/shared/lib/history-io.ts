import type { Message } from '@/entities/platform/types'

const VALID_ROLES = new Set(['user', 'assistant'])
const VALID_PLATFORMS = new Set([
  'twitter',
  'instagram',
  'linkedin',
  'facebook',
  'tiktok',
  'telegram',
])
const VALID_TONES = new Set(['professional', 'casual', 'humorous', 'inspirational', 'bold'])

function isValidMessage(obj: unknown): obj is Message {
  if (!obj || typeof obj !== 'object') return false
  const m = obj as Record<string, unknown>
  return (
    typeof m.id === 'string' &&
    typeof m.role === 'string' &&
    VALID_ROLES.has(m.role) &&
    typeof m.content === 'string' &&
    typeof m.platform === 'string' &&
    VALID_PLATFORMS.has(m.platform) &&
    typeof m.tone === 'string' &&
    VALID_TONES.has(m.tone) &&
    (typeof m.timestamp === 'string' ||
      m.timestamp instanceof Date ||
      typeof m.timestamp === 'number')
  )
}

export function exportHistory(messages: Message[]): void {
  const data = JSON.stringify(messages, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `postcraft-history-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importHistory(file: File): Promise<Message[]> {
  const text = await file.text()
  const parsed = JSON.parse(text)

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid format: expected an array of messages')
  }

  for (let i = 0; i < parsed.length; i++) {
    if (!isValidMessage(parsed[i])) {
      throw new Error(`Invalid message at index ${i}`)
    }
    parsed[i].timestamp = new Date(parsed[i].timestamp)
  }

  return parsed as Message[]
}

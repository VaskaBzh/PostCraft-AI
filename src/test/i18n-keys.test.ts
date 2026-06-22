import { describe, it, expect } from 'vitest'
import ruMessages from '../../messages/ru.json'
import enMessages from '../../messages/en.json'

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

describe('i18n key consistency', () => {
  const ruKeys = flattenKeys(ruMessages)
  const enKeys = flattenKeys(enMessages)

  it('ru.json and en.json have the same number of keys', () => {
    expect(ruKeys.length).toBe(enKeys.length)
  })

  it('every ru.json key exists in en.json', () => {
    const enKeySet = new Set(enKeys)
    const missingInEn = ruKeys.filter((k) => !enKeySet.has(k))
    expect(missingInEn).toEqual([])
  })

  it('every en.json key exists in ru.json', () => {
    const ruKeySet = new Set(ruKeys)
    const missingInRu = enKeys.filter((k) => !ruKeySet.has(k))
    expect(missingInRu).toEqual([])
  })

  it('no translation value is empty', () => {
    function checkEmpty(obj: Record<string, unknown>, locale: string, prefix = '') {
      const empties: string[] = []
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'string' && value.trim() === '') {
          empties.push(`${locale}:${fullKey}`)
        } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          empties.push(...checkEmpty(value as Record<string, unknown>, locale, fullKey))
        }
      }
      return empties
    }

    const ruEmpties = checkEmpty(ruMessages, 'ru')
    const enEmpties = checkEmpty(enMessages, 'en')
    expect([...ruEmpties, ...enEmpties]).toEqual([])
  })
})

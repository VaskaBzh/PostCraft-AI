import { describe, expect, it } from 'vitest'
import { routing } from '../routing'

describe('message files', () => {
  for (const locale of routing.locales) {
    it(`loads messages for locale "${locale}"`, async () => {
      const messages = (await import(`../../../messages/${locale}.json`)).default

      expect(messages).toBeDefined()
      expect(typeof messages).toBe('object')

      expect(messages.sidebar).toBeDefined()
      expect(messages.chat).toBeDefined()
      expect(messages.input).toBeDefined()
      expect(messages.message).toBeDefined()
      expect(messages.error).toBeDefined()
      expect(messages.history).toBeDefined()
      expect(messages.templates).toBeDefined()
      expect(messages.empty).toBeDefined()
      expect(messages.metadata).toBeDefined()
    })
  }

  it('all locales have the same top-level keys', async () => {
    const allMessages = await Promise.all(
      routing.locales.map((locale) => import(`../../../messages/${locale}.json`))
    )
    const keysets = allMessages.map((m) => new Set(Object.keys(m.default)))
    const baseKeys = keysets[0]
    for (const keys of keysets.slice(1)) {
      for (const key of baseKeys) {
        expect(keys.has(key), `Missing key "${key}" in one of the locales`).toBe(true)
      }
    }
  })

  it('quickPrompts array has 8 items for all locales', async () => {
    for (const locale of routing.locales) {
      const messages = (await import(`../../../messages/${locale}.json`)).default
      expect(messages.input.quickPrompts).toHaveLength(8)
    }
  })
})

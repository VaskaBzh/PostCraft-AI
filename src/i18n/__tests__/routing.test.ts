import { describe, expect, it } from 'vitest'
import { routing } from '../routing'

describe('routing config', () => {
  it('contains all expected locales', () => {
    expect(routing.locales).toEqual(['ru', 'en', 'es', 'de', 'fr'])
  })

  it('has ru as defaultLocale', () => {
    expect(routing.defaultLocale).toBe('ru')
  })

  it('has exactly 5 locales', () => {
    expect(routing.locales.length).toBe(5)
  })

  it('includes English', () => {
    expect(routing.locales).toContain('en')
  })
})

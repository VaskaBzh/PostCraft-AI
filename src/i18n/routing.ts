import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ru', 'en', 'es', 'de', 'fr'] as const,
  defaultLocale: 'ru',
})

export type Locale = (typeof routing.locales)[number]

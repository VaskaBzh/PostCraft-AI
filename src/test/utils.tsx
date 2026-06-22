/* eslint-disable import-x/export */
import { render, type RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactElement } from 'react'
import messages from '../../messages/ru.json'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="ru" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options })
}

export * from '@testing-library/react'
export { customRender as render }

/* eslint-disable import-x/export */
import {
  render,
  type RenderOptions,
  renderHook,
  type RenderHookOptions,
} from '@testing-library/react'
import type { ReactElement } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import ruMessages from '../../messages/ru.json'

function IntlWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="ru" messages={ruMessages}>
      {children}
    </NextIntlClientProvider>
  )
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: IntlWrapper, ...options })
}

function customRenderHook<Result, Props>(
  renderFn: (props: Props) => Result,
  options?: RenderHookOptions<Props>
) {
  return renderHook(renderFn, { wrapper: IntlWrapper, ...options })
}

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook }

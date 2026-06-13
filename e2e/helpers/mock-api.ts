import type { Page } from '@playwright/test'

export async function mockGenerateApi(
  page: Page,
  response = 'Это тестовый пост для публикации в социальных сетях.'
) {
  await page.route('/api/generate', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: response,
    })
  )
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

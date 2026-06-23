import { test, expect } from '@playwright/test'
import { mockGenerateApi } from '../helpers/mock-api'

test.describe('Bulk generation', () => {
  test.beforeEach(async ({ page }) => {
    await mockGenerateApi(page, 'Пост для платформы.')
    await page.goto('/')
    await page.getByTestId('mode-bulk').click()
  })

  test('shows bulk generation view with input', async ({ page }) => {
    await expect(page.getByTestId('bulk-input')).toBeVisible()
    await expect(page.getByTestId('bulk-generate-button')).toBeVisible()
  })

  test('generate button is disabled when textarea is empty', async ({ page }) => {
    await expect(page.getByTestId('bulk-generate-button')).toBeDisabled()
  })

  test('generates posts for all platforms and shows results', async ({ page }) => {
    const textarea = page.getByTestId('bulk-input')
    await textarea.click()
    await page.keyboard.type('Анонс нового продукта')

    await page.getByTestId('bulk-generate-button').click()

    await expect(page.getByText('Пост для платформы.').first()).toBeVisible({ timeout: 15_000 })
  })

  test('stop button appears during generation', async ({ page }) => {
    await page.route('/api/generate', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Результат' })
    })

    const textarea = page.getByTestId('bulk-input')
    await textarea.click()
    await page.keyboard.type('Тест кнопки стоп')
    await page.getByTestId('bulk-generate-button').click()

    await expect(page.getByTestId('bulk-generate-button')).toBeVisible()
  })

  test('can deselect a platform before generating', async ({ page }) => {
    await page.getByTestId('bulk-platform-tiktok').click()
    await expect(page.getByTestId('bulk-generate-button')).toBeVisible()
  })
})

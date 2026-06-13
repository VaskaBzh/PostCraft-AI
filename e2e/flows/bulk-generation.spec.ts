import { test, expect } from '@playwright/test'
import { mockGenerateApi } from '../helpers/mock-api'

test.describe('Bulk generation', () => {
  test.beforeEach(async ({ page }) => {
    await mockGenerateApi(page, 'Пост для платформы.')
    await page.goto('/')
    await page.getByRole('button', { name: 'Все платформы' }).click()
  })

  test('shows bulk generation view with platform checkboxes', async ({ page }) => {
    await expect(page.getByPlaceholder(/Опишите тему поста для всех платформ/)).toBeVisible()
    await expect(page.getByText(/Сгенерировать для/)).toBeVisible()
  })

  test('generate button is disabled when textarea is empty', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: /Сгенерировать для/ })
    await expect(generateBtn).toBeDisabled()
  })

  test('generates posts for all platforms and shows results', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему поста для всех платформ/)
    await textarea.fill('Анонс нового продукта')

    await page.getByRole('button', { name: /Сгенерировать для/ }).click()

    await expect(page.getByText('Пост для платформы.').first()).toBeVisible({ timeout: 15_000 })
  })

  test('stop button appears during generation', async ({ page }) => {
    await page.route('/api/generate', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Результат' })
    })

    const textarea = page.getByPlaceholder(/Опишите тему поста для всех платформ/)
    await textarea.fill('Тест кнопки стоп')
    await page.getByRole('button', { name: /Сгенерировать для/ }).click()

    await expect(page.getByRole('button', { name: 'Стоп' })).toBeVisible()
  })

  test('can deselect a platform before generating', async ({ page }) => {
    const tiktokBtn = page.getByRole('button', { name: /TikTok/ }).first()
    await tiktokBtn.click()

    const generateBtn = page.getByRole('button', { name: /Сгенерировать для 5 платформ/ })
    await expect(generateBtn).toBeVisible()
  })
})

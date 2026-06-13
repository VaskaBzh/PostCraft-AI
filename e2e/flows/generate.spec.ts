import { test, expect } from '@playwright/test'
import { mockGenerateApi } from '../helpers/mock-api'

test.describe('Post generation flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockGenerateApi(page)
    await page.goto('/')
  })

  test('renders the app with textarea and send button', async ({ page }) => {
    await expect(page.getByPlaceholder(/Опишите тему/)).toBeVisible()
    await expect(page.getByText('PostCraft AI')).toBeVisible()
  })

  test('send button is disabled when textarea is empty', async ({ page }) => {
    const sendBtn = page.getByTestId('send-button')
    await expect(sendBtn).toBeDisabled()
  })

  test('generates a post and shows it in chat', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.fill('Продвижение нового продукта')
    await page.getByTestId('send-button').click()

    await expect(page.getByText('Продвижение нового продукта')).toBeVisible()
    await expect(
      page.getByText('Это тестовый пост для публикации в социальных сетях.')
    ).toBeVisible()
  })

  test('clears textarea after submission', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.fill('Тема для поста')
    await page.getByTestId('send-button').click()

    await expect(textarea).toHaveValue('')
  })

  test('send via Ctrl+Enter keyboard shortcut', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.fill('Горячая клавиша тест')
    await textarea.press('Control+Enter')

    await expect(page.getByText('Горячая клавиша тест')).toBeVisible()
    await expect(
      page.getByText('Это тестовый пост для публикации в социальных сетях.')
    ).toBeVisible()
  })

  test('send button is disabled while generating', async ({ page }) => {
    await page.route('/api/generate', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Ответ' })
    })

    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.fill('Тест блокировки')
    await page.getByTestId('send-button').click()

    const sendBtn = page.getByTestId('send-button')
    await expect(sendBtn).toBeDisabled()
    await expect(page.getByText('Ответ')).toBeVisible()
  })
})

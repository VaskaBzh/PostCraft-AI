import { test, expect } from '@playwright/test'
import { mockGenerateApi } from '../helpers/mock-api'

test.describe('Post generation flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockGenerateApi(page)
    await page.goto('/')
    await page.getByTestId('send-button').waitFor({ state: 'attached' })
  })

  test('renders the app with input and send button', async ({ page }) => {
    await expect(page.getByTestId('chat-input')).toBeVisible()
    await expect(page.getByTestId('chat-title')).toBeVisible()
  })

  test('send button is disabled when textarea is empty', async ({ page }) => {
    const sendBtn = page.getByTestId('send-button')
    await expect(sendBtn).toBeDisabled()
  })

  test('generates a post and shows it in chat', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Продвижение нового продукта')
    await page.getByTestId('send-button').click()

    const main = page.locator('main')
    await expect(main.getByText('Продвижение нового продукта')).toBeVisible()
    await expect(
      main.getByText('Это тестовый пост для публикации в социальных сетях.')
    ).toBeVisible()
  })

  test('clears textarea after submission', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Тема для поста')
    await page.getByTestId('send-button').click()

    await expect(textarea).toHaveValue('', { timeout: 10_000 })
  })

  test('send via Ctrl+Enter keyboard shortcut', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Горячая клавиша тест')
    await textarea.press('Control+Enter')

    const main = page.locator('main')
    await expect(main.getByText('Горячая клавиша тест')).toBeVisible()
    await expect(
      main.getByText('Это тестовый пост для публикации в социальных сетях.')
    ).toBeVisible()
  })

  test('send button is disabled while generating', async ({ page }) => {
    await page.route('/api/generate', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Ответ' })
    })

    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Тест блокировки')
    await page.getByTestId('send-button').click()

    const sendBtn = page.getByTestId('send-button')
    await expect(sendBtn).toBeDisabled()
    await expect(page.locator('main').getByText('Ответ')).toBeVisible()
  })
})

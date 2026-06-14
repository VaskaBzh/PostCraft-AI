import { test, expect } from '@playwright/test'
import { mockGenerateApi } from '../helpers/mock-api'

test.use({ colorScheme: 'dark' })

test.describe('Visual regression', () => {
  test('initial layout — sidebar and empty state', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('initial-layout.png', { fullPage: false })
  })

  test('sidebar with Twitter selected', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'X / Twitter' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('aside')).toHaveScreenshot('sidebar-twitter.png')
  })

  test('chat with user and assistant messages', async ({ page }) => {
    await mockGenerateApi(page, 'Привет! Это демонстрационный пост для Instagram.')
    await page.goto('/')
    await page.locator('[data-testid="send-button"]').waitFor({ state: 'attached' })

    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.click()
    await page.keyboard.type('Тема поста')
    await page.getByTestId('send-button').click()

    const main = page.locator('main')
    await expect(main.getByText('Привет! Это демонстрационный пост для Instagram.')).toBeVisible()
    await expect(main).toHaveScreenshot('chat-with-messages.png')
  })

  test('bulk generation view initial state', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Все платформы' }).click()
    await page.waitForLoadState('networkidle')
    // Generous threshold — framer-motion fade-in animation can be at different points
    await expect(page).toHaveScreenshot('bulk-view-initial.png', {
      fullPage: false,
      maxDiffPixels: 300,
    })
  })
})

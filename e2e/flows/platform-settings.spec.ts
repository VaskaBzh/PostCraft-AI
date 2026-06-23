import { test, expect } from '@playwright/test'

test.describe('Platform settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('chat-subtitle').waitFor({ state: 'visible' })
  })

  test('default platform is Instagram', async ({ page }) => {
    await expect(page.getByTestId('chat-subtitle')).toContainText('Instagram')
  })

  test('clicking Twitter updates the chat header', async ({ page }) => {
    await page.getByTestId('platform-twitter').click()
    await expect(page.getByTestId('chat-subtitle')).toContainText('Twitter')
  })

  test('clicking LinkedIn updates the chat header', async ({ page }) => {
    await page.getByTestId('platform-linkedin').click()
    await expect(page.getByTestId('chat-subtitle')).toContainText('Linkedin')
  })

  test('clicking Facebook updates the chat header', async ({ page }) => {
    await page.getByTestId('platform-facebook').click()
    await expect(page.getByTestId('chat-subtitle')).toContainText('Facebook')
  })

  test('clicking a tone updates the chat header', async ({ page }) => {
    await page.getByTestId('tone-professional').click()
    const subtitle = page.getByTestId('chat-subtitle')
    await expect(subtitle).not.toContainText('Casual')
  })
})

import { test, expect } from '@playwright/test'

test.describe('i18n locale routing', () => {
  test('root / redirects to /ru/', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/ru(\/|$)/)
  })

  test('navigating to /en/ serves English UI', async ({ page }) => {
    await page.goto('/en/')
    await expect(page).toHaveURL(/\/en(\/|$)/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('PostCraft AI branding is visible in Russian locale', async ({ page }) => {
    await page.goto('/ru/')
    await expect(page.getByText('PostCraft AI')).toBeVisible()
  })

  test('PostCraft AI branding is visible in English locale', async ({ page }) => {
    await page.goto('/en/')
    await expect(page.getByText('PostCraft AI')).toBeVisible()
  })

  test('locale switcher select is rendered', async ({ page }) => {
    await page.goto('/ru/')
    const switcher = page.locator('[data-testid="locale-switcher"]')
    await expect(switcher).toBeVisible()
    await expect(switcher).toHaveValue('ru')
  })

  test('locale switcher changes URL to /en/ on selection', async ({ page }) => {
    await page.goto('/ru/')
    const switcher = page.locator('[data-testid="locale-switcher"]')
    await switcher.selectOption('en')
    await expect(page).toHaveURL(/\/en(\/|$)/)
  })

  test('lang attribute updates after locale switch', async ({ page }) => {
    await page.goto('/ru/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    await page.locator('[data-testid="locale-switcher"]').selectOption('en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('unsupported locale returns 404', async ({ page }) => {
    const response = await page.goto('/xx/')
    expect(response?.status()).toBe(404)
  })

  test('/ru/ page renders send button', async ({ page }) => {
    await page.goto('/ru/')
    await expect(page.locator('[data-testid="send-button"]')).toBeVisible()
  })

  test('/en/ page renders send button', async ({ page }) => {
    await page.goto('/en/')
    await expect(page.locator('[data-testid="send-button"]')).toBeVisible()
  })
})

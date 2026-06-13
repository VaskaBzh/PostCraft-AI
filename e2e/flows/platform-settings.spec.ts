import { test, expect } from '@playwright/test'

test.describe('Platform settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('default platform is Instagram', async ({ page }) => {
    await expect(page.getByText(/Instagram · /)).toBeVisible()
  })

  test('clicking Twitter updates the chat header', async ({ page }) => {
    await page.getByRole('button', { name: 'X / Twitter' }).click()
    await expect(page.getByText(/X \/ Twitter · /)).toBeVisible()
  })

  test('clicking LinkedIn updates the chat header', async ({ page }) => {
    await page.getByRole('button', { name: 'LinkedIn' }).click()
    await expect(page.getByText(/LinkedIn · /)).toBeVisible()
  })

  test('clicking Facebook updates the chat header', async ({ page }) => {
    await page.getByRole('button', { name: 'Facebook' }).click()
    await expect(page.getByText(/Facebook · /)).toBeVisible()
  })

  test('clicking a tone updates the chat header', async ({ page }) => {
    await page.getByRole('button', { name: 'Профессиональный' }).click()
    // Assert the header subtitle (platform · tone · language), not just the sidebar button
    await expect(page.getByText(/· Профессиональный ·/)).toBeVisible()
  })
})

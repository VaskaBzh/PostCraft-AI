import { test, expect } from '@playwright/test'
import { clearLocalStorage } from '../helpers/mock-api'

test.describe('Template save and load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('saves a template via bookmark button', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Промпт для шаблона')

    await page.getByTestId('save-template-button').click()
    const nameInput = page.getByTestId('template-name-input')
    await nameInput.fill('Мой тестовый шаблон')
    await nameInput.press('Enter')

    await expect(page.getByText('Мой тестовый шаблон')).toBeVisible()
  })

  test('loads a saved template into the textarea', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Промпт для загрузки')

    await page.getByTestId('save-template-button').click()
    const nameInput = page.getByTestId('template-name-input')
    await nameInput.fill('Шаблон загрузки')
    await nameInput.press('Enter')

    await textarea.clear()
    await expect(textarea).toHaveValue('')

    const loadButton = page.locator('[data-testid^="template-load-"]').first()
    await loadButton.click({ force: true })

    await expect(textarea).toHaveValue('Промпт для загрузки')
  })

  test('cancels template save with Escape key', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Тест отмены')

    await page.getByTestId('save-template-button').click()
    const nameInput = page.getByTestId('template-name-input')
    await nameInput.fill('Не сохранится')
    await nameInput.press('Escape')

    await expect(nameInput).not.toBeVisible()
    await expect(page.getByText('Не сохранится')).not.toBeVisible()
  })

  test('deletes a template', async ({ page }) => {
    const textarea = page.getByTestId('chat-input')
    await textarea.click()
    await page.keyboard.type('Удаляемый промпт')

    await page.getByTestId('save-template-button').click()
    const nameInput = page.getByTestId('template-name-input')
    await nameInput.fill('Для удаления')
    await nameInput.press('Enter')

    const deleteButton = page.locator('[data-testid^="template-delete-"]').first()
    await deleteButton.click({ force: true })

    await expect(page.getByText('Для удаления')).not.toBeVisible()
  })
})

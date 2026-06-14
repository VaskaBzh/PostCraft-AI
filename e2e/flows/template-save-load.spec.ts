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
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.click()
    await page.keyboard.type('Промпт для шаблона')

    await page.getByTitle('Сохранить как шаблон').click()
    const nameInput = page.getByPlaceholder('Название шаблона...')
    await nameInput.fill('Мой тестовый шаблон')
    await nameInput.press('Enter')

    await expect(page.getByText('Мой тестовый шаблон')).toBeVisible()
  })

  test('loads a saved template into the textarea', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.click()
    await page.keyboard.type('Промпт для загрузки')

    await page.getByTitle('Сохранить как шаблон').click()
    await page.getByPlaceholder('Название шаблона...').fill('Шаблон загрузки')
    await page.getByPlaceholder('Название шаблона...').press('Enter')

    await textarea.clear()
    await expect(textarea).toHaveValue('')

    // Hover the group container (2 levels up: text → flex-1 div → group div)
    const templateRow = page.getByText('Шаблон загрузки').locator('../..')
    await templateRow.hover()
    await page.getByTitle('Загрузить').click()

    await expect(textarea).toHaveValue('Промпт для загрузки')
  })

  test('cancels template save with Escape key', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.click()
    await page.keyboard.type('Тест отмены')

    await page.getByTitle('Сохранить как шаблон').click()
    const nameInput = page.getByPlaceholder('Название шаблона...')
    await nameInput.fill('Не сохранится')
    await nameInput.press('Escape')

    await expect(nameInput).not.toBeVisible()
    await expect(page.getByText('Не сохранится')).not.toBeVisible()
  })

  test('deletes a template', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Опишите тему/)
    await textarea.click()
    await page.keyboard.type('Удаляемый промпт')

    await page.getByTitle('Сохранить как шаблон').click()
    await page.getByPlaceholder('Название шаблона...').fill('Для удаления')
    await page.getByPlaceholder('Название шаблона...').press('Enter')

    await page.getByText('Для удаления').hover()
    await page.getByTitle('Удалить').click()

    await expect(page.getByText('Для удаления')).not.toBeVisible()
  })
})

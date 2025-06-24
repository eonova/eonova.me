import { expect, test } from '@playwright/test'

test.describe('Core Pages', () => {
  test.describe('About Page', () => {
    test('should display about page content', async ({ page }) => {
      await page.goto('/about')
      await page.waitForLoadState('networkidle')
      // Check for the page title or any heading that indicates we're on the about page
      await expect(page.getByRole('heading', { name: '关于' })).toBeVisible()
    })
  })

  test.describe('Posts Page', () => {
    test('should display posts listing', async ({ page }) => {
      await page.goto('/posts')
      await expect(page.getByRole('heading', { name: '文章' })).toBeVisible()
    })

    test('should show content or empty state', async ({ page }) => {
      await page.goto('/posts')
      await page.waitForLoadState('networkidle')

      // Should have either content or main area visible
      const mainContent = page.locator('main, [role="main"], .main-content')
      await expect(mainContent).toBeVisible()
    })
  })

  test.describe('Guestbook Page', () => {
    test('should display guestbook page', async ({ page }) => {
      await page.goto('/guestbook')
      await page.waitForLoadState('networkidle')
      // Use exact match to avoid multiple elements issue
      await expect(page.getByRole('heading', { name: '留言板', exact: true })).toBeVisible()
    })
  })
})

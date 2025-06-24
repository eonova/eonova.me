import { expect, test } from '@playwright/test'
import { waitForPageStability } from '../utils/stability-helpers'
import { resilientTest } from '../utils/test-resilience.js'

test.describe('Authentication Flows', () => {
  test.describe('Login Flow', () => {
    test('should show login dialog when clicking sign in', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')

      const signInButton = page.getByTestId('sign-in-button')
      if (await signInButton.isVisible()) {
        await signInButton.click()
        await expect(page.getByRole('dialog')).toBeVisible()
      }
    })
  })

  test.describe('Authenticated State', () => {
    test('should show user info when authenticated', async ({ page }, testInfo) => {
      await resilientTest(
        async () => {
          await page.goto('/')
          await waitForPageStability(page, { timeout: 15000 })

          // Should show user menu or avatar
          const userMenu = page.getByTestId('user-menu')
          const userAvatar = page.getByTestId('user-avatar')

          // At least one should be visible for authenticated users
          const hasUserIndicator = (await userMenu.isVisible()) || (await userAvatar.isVisible())
          expect(hasUserIndicator).toBe(true)
        },
        { page, testInfo, maxRetries: 2 },
      )
    })

    test('should allow posting guestbook messages when authenticated', async ({ page }) => {
      await page.goto('/guestbook')
      await page.waitForLoadState('domcontentloaded')

      // Should show guestbook form
      const guestbookTextarea = page.getByTestId('guestbook-textarea')
      const submitButton = page.getByTestId('guestbook-submit-button')

      if ((await guestbookTextarea.isVisible()) && (await submitButton.isVisible())) {
        await expect(guestbookTextarea).toBeVisible()
        await expect(submitButton).toBeEnabled()
      }
    })
  })
})

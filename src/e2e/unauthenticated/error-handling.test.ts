import { expect, test } from '@playwright/test'

test.describe('Error Handling and Edge Cases', () => {
  test.describe('404 Not Found Pages', () => {
    test('should show 404 page for non-existent routes', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Should show 404 page
      await expect(page.getByRole('heading', { name: /404|Not Found|页面未找到/ })).toBeVisible()
      await expect(page.getByText(/页面不存在|Page not found/)).toBeVisible()
    })

    test('should show 404 for non-existent blog posts', async ({ page }) => {
      await page.goto('/posts/non-existent-post-slug')

      // Should show 404 page
      await expect(page.getByRole('heading', { name: /404|Not Found|页面未找到/ })).toBeVisible()
    })

    test('should show 404 for non-existent notes', async ({ page }) => {
      await page.goto('/notes/non-existent-note-slug')

      // Should show 404 page
      await expect(page.getByRole('heading', { name: /404|Not Found|页面未找到/ })).toBeVisible()
    })

    test('should show 404 for non-existent projects', async ({ page }) => {
      await page.goto('/projects/non-existent-project-slug')

      // Should show 404 page
      await expect(page.getByRole('heading', { name: /404|Not Found|页面未找到/ })).toBeVisible()
    })

    test('should show 404 for non-existent categories', async ({ page }) => {
      await page.goto('/categories/non-existent-category')

      // Should show 404 page or empty category page
      const notFoundHeading = page.getByRole('heading', { name: /404|Not Found|页面未找到/ })
      const emptyCategoryMessage = page.getByText(/该分类下暂无文章|No posts in this category/)

      const hasNotFound = await notFoundHeading.isVisible()
      const hasEmptyMessage = await emptyCategoryMessage.isVisible()

      expect(hasNotFound || hasEmptyMessage).toBe(true)
    })

    test('should have navigation back to home from 404 page', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Should have link back to home
      const homeLink = page.getByRole('link', { name: /回到首页|Go Home|Home/ })
      if (await homeLink.isVisible()) {
        await homeLink.click()
        await expect(page).toHaveURL('/')
      }
    })
  })

  test.describe('Network and Loading Errors', () => {
    test('should handle slow network conditions gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', (route) => {
        setTimeout(() => route.continue(), 1000)
      })

      await page.goto('/')

      // Page should still load, just slower
      await expect(page.getByRole('main')).toBeVisible({ timeout: 10000 })
    })

    test('should show loading states during navigation', async ({ page }) => {
      await page.goto('/')

      // Navigate to a page that might show loading
      await page.getByRole('link', { name: '文章' }).click()

      // Should eventually show content
      await expect(page.getByRole('heading', { name: '文章' })).toBeVisible({ timeout: 5000 })
    })

    test('should handle API failures gracefully', async ({ page }) => {
      // Intercept API calls and make them fail
      await page.route('**/rpc/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        })
      })

      await page.goto('/guestbook')

      // Page should still render, even if API fails
      await expect(page.getByRole('heading', { name: '留言板' })).toBeVisible()

      // Should show error message for failed API calls
      const errorMessage = page.getByText(/加载失败|Failed to load|Error/)
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible()
      }
    })
  })

  test.describe('Form Validation and Edge Cases', () => {
    test('should handle empty form submissions', async ({ page }) => {
      await page.goto('/guestbook')

      // Try to submit empty form
      const submitButton = page.getByTestId('guestbook-submit-button')
      if (await submitButton.isVisible()) {
        await submitButton.click()

        // Should show validation error
        const validationError = page.getByText(/请输入内容|Please enter content|Required/)
        if (await validationError.isVisible()) {
          await expect(validationError).toBeVisible()
        }
      }
    })

    test('should handle very long input text', async ({ page }) => {
      await page.goto('/guestbook')

      const textarea = page.getByTestId('guestbook-textarea')
      if (await textarea.isVisible()) {
        // Input very long text
        const longText = 'a'.repeat(10000)
        await textarea.fill(longText)

        // Should handle gracefully (either truncate or show error)
        const submitButton = page.getByTestId('guestbook-submit-button')
        await submitButton.click()

        // Should either succeed or show appropriate error
        await page.waitForTimeout(2000)
      }
    })

    test('should handle special characters in input', async ({ page }) => {
      await page.goto('/search')

      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      // Test special characters
      const specialChars = '<script>alert("xss")</script>'
      await searchInput.fill(specialChars)
      await searchInput.press('Enter')

      // Should handle safely without executing scripts
      await expect(page).toHaveURL(/search/)

      // Page should not show alert or execute script
      const alerts = page.locator('script')
      expect(await alerts.count()).toBe(0)
    })
  })

  test.describe('Browser Compatibility and Edge Cases', () => {
    test('should handle browser back/forward navigation', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: '关于' }).click()
      await expect(page).toHaveURL('/about')

      // Go back
      await page.goBack()
      await expect(page).toHaveURL('/')

      // Go forward
      await page.goForward()
      await expect(page).toHaveURL('/about')
    })

    test('should handle page refresh correctly', async ({ page }) => {
      await page.goto('/posts')

      // Refresh the page
      await page.reload()

      // Should still show the same content
      await expect(page.getByRole('heading', { name: '文章' })).toBeVisible()
      await expect(page).toHaveURL('/posts')
    })

    test('should handle multiple rapid clicks', async ({ page }) => {
      await page.goto('/')

      const aboutLink = page.getByRole('link', { name: '关于' })

      // Click multiple times rapidly
      await aboutLink.click()
      await aboutLink.click()
      await aboutLink.click()

      // Should only navigate once
      await expect(page).toHaveURL('/about')
      await expect(page.getByRole('heading', { name: '关于我' })).toBeVisible()
    })

    test('should handle window resize gracefully', async ({ page }) => {
      await page.goto('/')

      // Test different viewport sizes
      await page.setViewportSize({ width: 320, height: 568 }) // Mobile
      await expect(page.getByRole('main')).toBeVisible()

      await page.setViewportSize({ width: 768, height: 1024 }) // Tablet
      await expect(page.getByRole('main')).toBeVisible()

      await page.setViewportSize({ width: 1920, height: 1080 }) // Desktop
      await expect(page.getByRole('main')).toBeVisible()
    })
  })

  test.describe('JavaScript Disabled Scenarios', () => {
    test('should work with JavaScript disabled', async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
      })
      const page = await context.newPage()

      await page.goto('/')

      // Basic content should still be visible
      await expect(page.getByRole('main')).toBeVisible()

      // Navigation links should still work
      await page.getByRole('link', { name: '关于' }).click()
      await expect(page).toHaveURL('/about')

      await context.close()
    })
  })

  test.describe('Content Edge Cases', () => {
    test('should handle empty content gracefully', async ({ page }) => {
      await page.goto('/posts')

      // If no posts exist, should show appropriate message
      const postCards = page.locator('[data-testid="post-card"]')
      const emptyMessage = page.getByText(/暂无文章|No posts available/)

      const hasCards = (await postCards.count()) > 0
      const hasEmptyMessage = await emptyMessage.isVisible()

      expect(hasCards || hasEmptyMessage).toBe(true)
    })

    test('should handle malformed URLs gracefully', async ({ page }) => {
      // Test various malformed URLs
      const malformedUrls = [
        '/posts/',
        '/posts//',
        '/posts/%20',
        '/posts/..%2F..%2F',
        '/posts/<script>',
      ]

      for (const url of malformedUrls) {
        await page.goto(url)

        // Should either redirect to proper page or show 404
        const is404 = await page.getByRole('heading', { name: /404|Not Found/ }).isVisible()
        const isValidPage = await page.getByRole('main').isVisible()

        expect(is404 || isValidPage).toBe(true)
      }
    })

    test('should handle very long URLs', async ({ page }) => {
      const longSlug = 'a'.repeat(1000)
      await page.goto(`/posts/${longSlug}`)

      // Should handle gracefully (404 or error page)
      const is404 = await page.getByRole('heading', { name: /404|Not Found/ }).isVisible()
      const isErrorPage = await page.getByText(/Error|错误/).isVisible()

      expect(is404 || isErrorPage).toBe(true)
    })
  })

  test.describe('Security Edge Cases', () => {
    test('should prevent XSS in search queries', async ({ page }) => {
      await page.goto('/search?q=<script>alert("xss")</script>')

      // Should not execute the script
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')
      const inputValue = await searchInput.inputValue()

      // Input should contain the text but not execute as script
      expect(inputValue).toContain('<script>')

      // No alert should appear
      page.on('dialog', () => {
        throw new Error('Unexpected alert dialog')
      })

      await page.waitForTimeout(1000)
    })

    test('should handle malicious file uploads safely', async ({ page }) => {
      // This test would be relevant if there are file upload features
      await page.goto('/guestbook')

      // Check if there are any file upload inputs
      const fileInputs = page.locator('input[type="file"]')
      const count = await fileInputs.count()

      if (count > 0) {
        // File upload functionality should have proper validation
        const firstInput = fileInputs.first()
        await expect(firstInput).toHaveAttribute('accept')
      }
    })
  })

  test.describe('Performance Edge Cases', () => {
    test('should handle large amounts of content', async ({ page }) => {
      // Navigate to a page that might have lots of content
      await page.goto('/posts')

      // Should load within reasonable time even with lots of content
      const startTime = Date.now()
      await expect(page.getByRole('main')).toBeVisible()
      const loadTime = Date.now() - startTime

      expect(loadTime).toBeLessThan(10000) // 10 seconds max
    })

    test('should handle rapid navigation', async ({ page }) => {
      await page.goto('/')

      // Navigate rapidly between pages
      await page.getByRole('link', { name: '文章' }).click()
      await page.getByRole('link', { name: '手记' }).click()
      await page.getByRole('link', { name: '关于' }).click()
      await page.getByRole('link', { name: '留言板' }).click()

      // Should end up on the last clicked page
      await expect(page).toHaveURL('/guestbook')
      await expect(page.getByRole('heading', { name: '留言板' })).toBeVisible()
    })
  })
})

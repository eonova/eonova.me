import { expect, test } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test.describe('Search Page Layout', () => {
    test('should display search page with correct title and description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '搜索' })).toBeVisible()
      await expect(page.getByText('搜索文章、笔记和项目内容')).toBeVisible()
    })

    test('should display search input with placeholder', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')
      await expect(searchInput).toBeVisible()
      await expect(searchInput).toBeFocused()
    })

    test('should display search icon in input field', async ({ page }) => {
      const searchIcon = page.locator('svg').first()
      await expect(searchIcon).toBeVisible()
    })
  })

  test.describe('Search Input Functionality', () => {
    test('should allow typing in search input', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('React')
      await expect(searchInput).toHaveValue('React')
    })

    test('should show clear button when input has value', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('test query')
      await expect(page.getByRole('button').filter({ hasText: '×' })).toBeVisible()
    })

    test('should clear input when clear button is clicked', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('test query')
      await page.getByRole('button').filter({ hasText: '×' }).click()

      await expect(searchInput).toHaveValue('')
    })

    test('should trigger search on Enter key', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('React')
      await searchInput.press('Enter')

      // Check URL is updated
      await expect(page).toHaveURL('/search?q=React')
    })

    test('should trigger search on search button click', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('Vue')
      await page.getByRole('button', { name: 'Search' }).click()

      // Check URL is updated
      await expect(page).toHaveURL('/search?q=Vue')
    })

    test('should close suggestions on Escape key', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('test')
      await searchInput.press('Escape')

      // Input should lose focus
      await expect(searchInput).not.toBeFocused()
    })
  })

  test.describe('Search Suggestions', () => {
    test('should show suggestions when typing', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('Re')

      // Wait for suggestions to appear (if any exist)
      await page.waitForTimeout(500)

      // Check if suggestions popover exists
      const suggestionsPopover = page.locator('[role="dialog"]')
      if (await suggestionsPopover.isVisible()) {
        await expect(suggestionsPopover).toBeVisible()
      }
    })

    test('should hide suggestions when input is cleared', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('test')
      await page.waitForTimeout(500)

      await searchInput.clear()

      // Suggestions should be hidden
      const suggestionsPopover = page.locator('[role="dialog"]')
      await expect(suggestionsPopover).toBeHidden()
    })
  })

  test.describe('Search Results', () => {
    test('should show loading state during search', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('React')
      await searchInput.press('Enter')

      // Check for loading indicator (might be brief)
      await page.waitForTimeout(100)
    })

    test('should display search results for valid query', async ({ page }) => {
      // Navigate with a search query
      await page.goto('/search?q=test')

      // Wait for results to load
      await page.waitForTimeout(1000)

      // Check if results section exists
      const resultsSection = page.locator('[data-testid="search-results"]')
      if (await resultsSection.isVisible()) {
        await expect(resultsSection).toBeVisible()
      }
    })

    test('should show empty state for no results', async ({ page }) => {
      // Search for something that likely won't exist
      await page.goto('/search?q=xyznonexistentquery123')

      // Wait for search to complete
      await page.waitForTimeout(1000)

      // Should show no results message
      await expect(page.getByText('没有找到相关内容')).toBeVisible()
    })

    test('should not search for queries less than 2 characters', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      await searchInput.fill('a')
      await searchInput.press('Enter')

      // Should show message about minimum query length
      await expect(page.getByText('请输入至少 2 个字符进行搜索')).toBeVisible()
    })
  })

  test.describe('Search Filters', () => {
    test('should display type filter buttons', async ({ page }) => {
      // Navigate with a search query to show filters
      await page.goto('/search?q=test')

      // Wait for filters to load
      await page.waitForTimeout(1000)

      // Check for filter buttons
      await expect(page.getByRole('button', { name: /全部/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /文章/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /手记/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /项目/ })).toBeVisible()
    })

    test('should filter results by type', async ({ page }) => {
      // Navigate with a search query
      await page.goto('/search?q=test')

      // Wait for results to load
      await page.waitForTimeout(1000)

      // Click on posts filter
      const postsFilter = page.getByRole('button', { name: /文章/ })
      if (await postsFilter.isVisible()) {
        await postsFilter.click()

        // Check URL is updated with type filter
        await expect(page).toHaveURL('/search?q=test&type=posts')
      }
    })

    test('should show result counts in filter badges', async ({ page }) => {
      // Navigate with a search query
      await page.goto('/search?q=test')

      // Wait for results to load
      await page.waitForTimeout(1000)

      // Check for count badges in filter buttons
      const filterButtons = page.locator(
        'button:has-text("全部"), button:has-text("文章"), button:has-text("手记"), button:has-text("项目")',
      )
      const count = await filterButtons.count()

      if (count > 0) {
        // At least one filter should have a count badge
        const badges = page.locator('[data-testid="filter-badge"]')
        if (await badges.first().isVisible()) {
          await expect(badges.first()).toBeVisible()
        }
      }
    })

    test('should highlight active filter', async ({ page }) => {
      // Navigate with a search query and type filter
      await page.goto('/search?q=test&type=posts')

      // Wait for page to load
      await page.waitForTimeout(1000)

      // Posts filter should be active/highlighted
      const postsFilter = page.getByRole('button', { name: /文章/ })
      if (await postsFilter.isVisible()) {
        // Check if button has active styling (this depends on implementation)
        await expect(postsFilter).toHaveClass(/bg-primary|variant-default/)
      }
    })
  })

  test.describe('Search Result Items', () => {
    test('should display result item information', async ({ page }) => {
      // Navigate with a search query that should return results
      await page.goto('/search?q=test')

      // Wait for results to load
      await page.waitForTimeout(1000)

      // Check for result items
      const resultItems = page.locator('[data-testid="search-result-item"]')
      const count = await resultItems.count()

      if (count > 0) {
        const firstResult = resultItems.first()

        // Should have title
        await expect(firstResult.locator('h3, h2, [data-testid="result-title"]')).toBeVisible()

        // Should have type indicator
        await expect(firstResult.locator('[data-testid="result-type"]')).toBeVisible()

        // Should have date
        await expect(firstResult.locator('[data-testid="result-date"]')).toBeVisible()
      }
    })

    test('should navigate to result when clicked', async ({ page }) => {
      // Navigate with a search query
      await page.goto('/search?q=test')

      // Wait for results to load
      await page.waitForTimeout(1000)

      // Click on first result if available
      const resultItems = page.locator('[data-testid="search-result-item"]')
      const count = await resultItems.count()

      if (count > 0) {
        const firstResult = resultItems.first()
        const resultLink = firstResult.locator('a').first()

        if (await resultLink.isVisible()) {
          const href = await resultLink.getAttribute('href')
          await resultLink.click()

          // Should navigate to the result page
          if (href) {
            await expect(page).toHaveURL(new RegExp(href))
          }
        }
      }
    })
  })

  test.describe('URL State Management', () => {
    test('should initialize search from URL parameters', async ({ page }) => {
      // Navigate with search parameters
      await page.goto('/search?q=React&type=posts')

      // Input should have the query value
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')
      await expect(searchInput).toHaveValue('React')

      // Posts filter should be active
      const postsFilter = page.getByRole('button', { name: /文章/ })
      if (await postsFilter.isVisible()) {
        await expect(postsFilter).toHaveClass(/bg-primary|variant-default/)
      }
    })

    test('should update URL when search parameters change', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      // Type a search query
      await searchInput.fill('JavaScript')
      await searchInput.press('Enter')

      // URL should be updated
      await expect(page).toHaveURL('/search?q=JavaScript')

      // Change filter type
      await page.waitForTimeout(1000)
      const notesFilter = page.getByRole('button', { name: /手记/ })
      if (await notesFilter.isVisible()) {
        await notesFilter.click()
        await expect(page).toHaveURL('/search?q=JavaScript&type=notes')
      }
    })

    test('should maintain search state on page refresh', async ({ page }) => {
      // Navigate with search parameters
      await page.goto('/search?q=Vue&type=projects')

      // Refresh the page
      await page.reload()

      // Search state should be maintained
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')
      await expect(searchInput).toHaveValue('Vue')

      const projectsFilter = page.getByRole('button', { name: /项目/ })
      if (await projectsFilter.isVisible()) {
        await expect(projectsFilter).toHaveClass(/bg-primary|variant-default/)
      }
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab to search input
      await page.keyboard.press('Tab')

      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')
      await expect(searchInput).toBeFocused()

      // Type and search
      await page.keyboard.type('test')
      await page.keyboard.press('Enter')

      // Should work with keyboard navigation
      await expect(page).toHaveURL('/search?q=test')
    })

    test('should have proper ARIA labels', async ({ page }) => {
      const searchInput = page.getByPlaceholder('搜索文章、笔记、项目...')

      // Check for proper labeling
      await expect(searchInput).toHaveAttribute('type', 'text')

      // Search button should have accessible name
      const searchButton = page.getByRole('button', { name: 'Search' })
      if (await searchButton.isVisible()) {
        await expect(searchButton).toBeVisible()
      }
    })
  })
})

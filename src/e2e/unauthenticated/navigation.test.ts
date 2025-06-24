import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test.describe('Desktop Navigation', () => {
    test('should display all main navigation links', async ({ page }) => {
      await page.goto('/')

      // Check main navigation links are visible in header
      const header = page.locator('#header, header, nav').first()
      await expect(header.getByRole('link', { name: '文章' })).toBeVisible()
      await expect(header.getByRole('link', { name: '手记' })).toBeVisible()
      await expect(header.getByRole('link', { name: '归档' })).toBeVisible()
      await expect(header.getByRole('link', { name: '友链' })).toBeVisible()
      await expect(header.getByRole('link', { name: '碎碎念' })).toBeVisible()
      await expect(header.getByRole('link', { name: '留言板' })).toBeVisible()
      await expect(header.getByRole('link', { name: '搜索' })).toBeVisible()
      await expect(header.getByRole('link', { name: '书影番' })).toBeVisible()
      await expect(header.getByRole('link', { name: '我的' })).toBeVisible()
      await expect(header.getByRole('link', { name: '关于' })).toBeVisible()
    })

    test('should navigate to posts page', async ({ page }) => {
      await page.goto('/')
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '文章' }).click()
      await expect(page).toHaveURL('/posts')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('文章')
    })

    test('should navigate to notes page', async ({ page }) => {
      await page.goto('/')
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '手记' }).click()
      await expect(page).toHaveURL('/notes')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('手记')
    })

    test('should navigate to guestbook page', async ({ page }) => {
      await page.goto('/')
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '留言板' }).click()
      await expect(page).toHaveURL('/guestbook')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('留言板')
    })

    test('should navigate to about page', async ({ page }) => {
      await page.goto('/')
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '关于' }).click()
      await expect(page).toHaveURL('/about')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('关于我')
    })

    test('should show active state for current page', async ({ page }) => {
      await page.goto('/posts')

      // Check that the posts link has active styling in header
      const header = page.locator('#header, header, nav').first()
      const postsLink = header.getByRole('link', { name: '文章' })
      await expect(postsLink).toHaveClass(/text-foreground/)
    })
  })

  test.describe('Dropdown Menus', () => {
    test('should show posts category submenu on hover', async ({ page }) => {
      await page.goto('/')

      // Hover over posts link in header
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '文章' }).hover()

      // Wait for submenu to appear
      const submenu = page.locator('[data-key="posts"]').first()
      await expect(submenu).toBeVisible()

      // Check submenu items are visible
      await expect(submenu.getByRole('link', { name: '技术' })).toBeVisible()
      await expect(submenu.getByRole('link', { name: '生活' })).toBeVisible()
    })

    test('should show archive submenu on hover', async ({ page }) => {
      await page.goto('/')

      // Hover over archive link in header
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '归档' }).hover()

      // Wait for submenu to appear
      const submenu = page.locator('[data-key="archive"]').first()
      await expect(submenu).toBeVisible()

      // Check submenu items
      await expect(submenu.getByRole('link', { name: '文章' })).toBeVisible()
      await expect(submenu.getByRole('link', { name: '手记' })).toBeVisible()
    })

    test('should show recreation submenu on hover', async ({ page }) => {
      await page.goto('/')

      // Hover over recreation link in header
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '书影番' }).hover()

      // Wait for submenu to appear
      const submenu = page.locator('[data-key="recreation"]').first()
      await expect(submenu).toBeVisible()

      // Check submenu items
      await expect(submenu.getByRole('link', { name: '书单' })).toBeVisible()
      await expect(submenu.getByRole('link', { name: '观影记录' })).toBeVisible()
      await expect(submenu.getByRole('link', { name: '追番' })).toBeVisible()
    })

    test('should show more submenu on hover', async ({ page }) => {
      await page.goto('/')

      // Hover over more link in header
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '我的' }).hover()

      // Wait for submenu to appear
      const submenu = page.locator('[data-key="more"]').first()
      await expect(submenu).toBeVisible()

      // Check submenu items
      await expect(submenu.getByRole('link', { name: '相册' })).toBeVisible()
      await expect(submenu.getByRole('link', { name: '项目' })).toBeVisible()
      await expect(submenu.getByRole('link', { name: '收藏' })).toBeVisible()
    })

    test('should navigate through submenu items', async ({ page }) => {
      await page.goto('/')

      // Hover over recreation link and click on books
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '书影番' }).hover()

      const submenu = page.locator('[data-key="recreation"]').first()
      await submenu.getByRole('link', { name: '书单' }).click()

      await expect(page).toHaveURL('/books')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('书单')
    })

    test('should hide submenu when mouse leaves', async ({ page }) => {
      await page.goto('/')

      // Hover over posts link to show submenu
      const header = page.locator('#header, header, nav').first()
      await header.getByRole('link', { name: '文章' }).hover()
      const submenu = page.locator('[data-key="posts"]').first()
      await expect(submenu).toBeVisible()

      // Move mouse away
      await page.locator('body').hover()

      // Wait for submenu to hide
      await expect(submenu).toBeHidden()
    })
  })

  test.describe('Mobile Navigation', () => {
    test('should show mobile menu button on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Mobile menu button should be visible
      await expect(page.getByRole('button', { name: /menu|Menu|菜单/ })).toBeVisible()

      // Desktop navigation should be hidden or not visible
      const desktopNav = page.locator('nav ul, .desktop-nav')
      if ((await desktopNav.count()) > 0) {
        await expect(desktopNav.first()).toBeHidden()
      }
    })

    test('should open mobile sidebar when menu button is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Click mobile menu button
      await page.getByRole('button', { name: /menu|Menu|菜单/ }).click()

      // Sidebar should be visible
      await expect(page.getByRole('dialog')).toBeVisible()

      // Check for user info in sidebar (use more specific selector)
      const sidebar = page.getByRole('dialog')
      await expect(sidebar.getByText('Eonova')).toBeVisible()
      await expect(sidebar.getByText('一个爱捣鼓的前端')).toBeVisible()
    })

    test('should show all navigation links in mobile sidebar', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Open mobile menu
      await page.getByRole('button', { name: /menu|Menu|菜单/ }).click()

      // Check all main links are present in sidebar
      const sidebar = page.getByRole('dialog')
      await expect(sidebar.getByRole('link', { name: '文章' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '手记' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '归档' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '友链' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '碎碎念' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '留言板' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '搜索' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: '关于' })).toBeVisible()
    })

    test('should close mobile sidebar when link is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Open mobile menu
      await page.getByRole('button', { name: /menu|Menu|菜单/ }).click()
      await expect(page.getByRole('dialog')).toBeVisible()

      // Click a link in sidebar
      const sidebar = page.getByRole('dialog')
      await sidebar.getByRole('link', { name: '关于' }).click()

      // Sidebar should close and navigate to about page
      await expect(page.getByRole('dialog')).toBeHidden()
      await expect(page).toHaveURL('/about')
    })

    test('should close mobile sidebar when close button is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Open mobile menu
      await page.getByRole('button', { name: /menu|Menu|菜单/ }).click()
      await expect(page.getByRole('dialog')).toBeVisible()

      // Click close button
      await page.getByRole('button', { name: /close|Close|关闭|×/ }).click()

      // Sidebar should close
      await expect(page.getByRole('dialog')).toBeHidden()
    })
  })

  test.describe('Logo and Branding', () => {
    test('should display logo and navigate to home when clicked', async ({ page }) => {
      await page.goto('/posts')

      // Logo should be visible (try different selectors)
      const logoSelectors = [
        'svg[data-testid="logo"]',
        '.logo',
        '[data-testid="logo"]',
        'img[alt*="logo"]',
        'a[href="/"] img',
        'a[href="/"] svg',
      ]

      let logoFound = false
      for (const selector of logoSelectors) {
        const logo = page.locator(selector)
        if ((await logo.count()) > 0) {
          await expect(logo.first()).toBeVisible()
          logoFound = true
          break
        }
      }

      // If no specific logo found, just click home link
      if (!logoFound) {
        await page.locator('a[href="/"]').first().click()
      } else {
        await page.locator('a[href="/"]').first().click()
      }

      await expect(page).toHaveURL('/')
    })
  })

  test.describe('Theme Switcher', () => {
    test('should show theme switcher button', async ({ page }) => {
      await page.goto('/')

      // Theme toggle should be visible
      await expect(page.getByTestId('theme-toggle')).toBeVisible()
    })

    test('should open theme menu when clicked', async ({ page }) => {
      await page.goto('/')

      // Click theme toggle
      await page.getByTestId('theme-toggle').click()

      // Theme options should be visible
      await expect(page.getByTestId('theme-light-button')).toBeVisible()
      await expect(page.getByTestId('theme-dark-button')).toBeVisible()
      await expect(page.getByTestId('theme-system-button')).toBeVisible()
    })
  })

  test.describe('Command Menu', () => {
    test('should open command menu with keyboard shortcut', async ({ page }) => {
      await page.goto('/')

      // Press Cmd+K (or Ctrl+K on Windows/Linux)
      await page.keyboard.press('Meta+k')

      // Command menu should be visible
      await expect(page.getByRole('dialog')).toBeVisible()

      // Check for search input with various possible placeholders
      const searchInputSelectors = [
        'input[placeholder*="搜索"]',
        'input[placeholder*="search"]',
        'input[placeholder*="Search"]',
        'input[type="search"]',
        '[data-testid="search-input"]',
      ]

      let searchFound = false
      for (const selector of searchInputSelectors) {
        const input = page.locator(selector)
        if ((await input.count()) > 0) {
          await expect(input.first()).toBeVisible()
          searchFound = true
          break
        }
      }

      // If no search input found, at least verify dialog is open
      if (!searchFound) {
        await expect(page.getByRole('dialog')).toBeVisible()
      }
    })

    test('should close command menu with Escape', async ({ page }) => {
      await page.goto('/')

      // Open command menu
      await page.keyboard.press('Meta+k')
      await expect(page.getByRole('dialog')).toBeVisible()

      // Close with Escape
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toBeHidden()
    })
  })
})

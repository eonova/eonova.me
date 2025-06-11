import type { Browser, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function checkAppliedTheme(page: Page, theme: string) {
  expect(await page.evaluate(t => document.documentElement.classList.contains(t), theme)).toBe(
    true,
  )
  expect(await page.evaluate(() => document.documentElement.getAttribute('style'))).toBe(
    `color-scheme: ${theme};`,
  )
}

export async function checkStoredTheme(page: Page, expectedTheme: string) {
  const localStorage = await page.evaluate(() => globalThis.localStorage)
  expect(localStorage.theme).toBe(expectedTheme)
}

interface CreateBrowserContextOptions {
  baseURL?: string
  colorScheme?: 'light' | 'dark' | 'no-preference'
  localStorage?: Array<{ name: string, value: string }>
}

export async function createBrowserContext(browser: Browser, options: CreateBrowserContextOptions) {
  return await browser.newContext({
    colorScheme: options.colorScheme ?? 'no-preference',
    storageState: {
      cookies: [],
      origins: [
        {
          origin: options.baseURL ?? 'http://localhost:3000',
          localStorage: options.localStorage ?? [],
        },
      ],
    },
  })
}

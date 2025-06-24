import type { Page } from '@playwright/test'

// 等待页面完全加载和稳定
export async function waitForPageStability(
  page: Page,
  options: {
    timeout?: number
    networkIdleTimeout?: number
    additionalWait?: number
  } = {},
) {
  const { timeout = 30000, networkIdleTimeout = 2000, additionalWait = 1000 } = options

  // 等待基本加载状态
  await page.waitForLoadState('domcontentloaded', { timeout })

  // 等待网络空闲
  await page.waitForLoadState('networkidle', { timeout: networkIdleTimeout })

  // 等待字体加载
  await page
    .waitForFunction(() => document.fonts.ready, { timeout: 5000 })
    .catch(() => {
      console.warn('Font loading timeout - continuing anyway')
    })

  // 等待任何动画完成
  await page.waitForTimeout(additionalWait)

  // 确保没有正在进行的请求
  await page
    .waitForFunction(
      () => {
        return (
          (window as any).fetch === undefined ||
          !(window as any).pendingRequests ||
          (window as any).pendingRequests === 0
        )
      },
      { timeout: 5000 },
    )
    .catch(() => {
      console.warn('Pending requests timeout - continuing anyway')
    })
}

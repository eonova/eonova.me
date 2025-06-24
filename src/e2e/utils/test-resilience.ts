import type { Page, TestInfo } from '@playwright/test'

// Test context interface
interface TestContext {
  page: Page
  testInfo: TestInfo
  retryCount: number
  maxRetries: number
}

// Recovery strategy interface
interface RecoveryStrategy {
  name: string
  condition: (error: Error) => boolean
  action: (context: TestContext) => Promise<void>
}

// Default recovery strategies
const RECOVERY_STRATEGIES: RecoveryStrategy[] = [
  {
    name: 'Page Reload',
    condition: (error) => error.message.includes('Navigation') || error.message.includes('timeout'),
    action: async (context) => {
      console.log('🔄 Attempting page reload recovery...')
      await context.page.reload({ waitUntil: 'domcontentloaded' })
      await context.page.waitForTimeout(2000)
    },
  },
  {
    name: 'Clear Storage',
    condition: (error) =>
      error.message.includes('storage') || error.message.includes('localStorage'),
    action: async (context) => {
      console.log('🧹 Attempting storage clear recovery...')
      await context.page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
      await context.page.reload({ waitUntil: 'domcontentloaded' })
    },
  },
  {
    name: 'Wait and Retry',
    condition: () => true, // Fallback strategy
    action: async (context) => {
      console.log('⏳ Attempting wait and retry recovery...')
      await context.page.waitForTimeout(3000)
    },
  },
]

// Attempt recovery using available strategies
async function attemptRecovery(
  context: TestContext,
  error: Error,
  strategies: RecoveryStrategy[] = RECOVERY_STRATEGIES,
): Promise<boolean> {
  console.log(`🔧 Attempting recovery for error: ${error.message}`)

  for (const strategy of strategies) {
    if (strategy.condition(error)) {
      try {
        console.log(`🎯 Trying recovery strategy: ${strategy.name}`)
        await strategy.action(context)
        console.log(`✅ Recovery strategy "${strategy.name}" succeeded`)
        return true
      } catch (recoveryError) {
        console.log(`❌ Recovery strategy "${strategy.name}" failed:`, recoveryError)
      }
    }
  }

  return false
}

// Resilient test execution wrapper
export async function resilientTest<T>(
  testFn: (context: TestContext) => Promise<T>,
  context: Omit<TestContext, 'retryCount'>,
  options: {
    maxRetries?: number
    recoveryStrategies?: RecoveryStrategy[]
    onRetry?: (error: Error, retryCount: number) => void
  } = {},
): Promise<T> {
  const { maxRetries = 3, recoveryStrategies = RECOVERY_STRATEGIES, onRetry } = options

  let lastError: Error | undefined

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      const fullContext: TestContext = { ...context, retryCount, maxRetries }
      return await testFn(fullContext)
    } catch (error) {
      lastError = error as Error

      if (retryCount === maxRetries) {
        console.log(`💥 Test failed after ${maxRetries} retries`)
        throw lastError
      }

      if (onRetry) {
        onRetry(lastError, retryCount)
      }

      const fullContext: TestContext = { ...context, retryCount, maxRetries }
      const recovered = await attemptRecovery(fullContext, lastError, recoveryStrategies)

      if (!recovered) {
        console.log(`⚠️ No suitable recovery strategy found for error: ${lastError.message}`)
        // Still continue retrying, but without specific recovery strategy
        await context.page.waitForTimeout(2000)
      }
    }
  }

  throw lastError || new Error('Recovery failed: no errors were captured')
}

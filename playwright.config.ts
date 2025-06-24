import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI

const baseURL = 'http://localhost:3000'

export default defineConfig({
  globalTimeout: CI ? 1000 * 60 * 10 : undefined, // Reduce global timeout for faster feedback
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 1, // Reduce retries for faster execution
  workers: CI ? 1 : 3, // Increase workers for faster local development
  reporter: CI ? 'github' : 'list', // Use faster reporters
  timeout: 45000, // Reduce default test timeout for faster feedback
  use: {
    baseURL,
    trace: 'retain-on-failure', // Only keep traces on failure
    video: 'retain-on-failure', // Only keep videos on failure
    screenshot: 'only-on-failure',
    // Reduce timeouts for faster feedback
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
  // Visual testing configuration
  expect: {
    // Animation handling
    toHaveScreenshot: {
      animations: 'disabled',
      threshold: 0.3,
      caret: 'hide',
    },
    toMatchSnapshot: {
      threshold: 0.3,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /\.setup\.ts$/,
      teardown: 'teardown',
      timeout: 60000, // Reduce setup timeout
    },
    {
      name: 'authenticated',
      testMatch: /authenticated\/.*\.test\.ts$/,
      dependencies: ['setup'],
      timeout: 45000, // Reduce timeout for faster feedback
      use: {
        ...devices['Desktop Chrome'],
        storageState: './src/e2e/.auth/user.json',
        actionTimeout: 10000,
        navigationTimeout: 20000,
      },
    },
    {
      name: 'unauthenticated',
      testMatch: /unauthenticated\/.*\.test\.ts$/,
      dependencies: ['setup'],
      timeout: 45000,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    // Only run visual tests in CI or when explicitly requested
    ...(CI || process.env.RUN_VISUAL_TESTS
      ? [
          {
            name: 'visual',
            testMatch: /\.visual\.test\.ts$/,
            dependencies: ['setup'],
            timeout: 60000, // Reduce visual test timeout
            use: {
              ...devices['Desktop Chrome'],
              actionTimeout: 15000,
              navigationTimeout: 30000,
            },
          },
        ]
      : []),
    { name: 'teardown', testMatch: /global\.teardown\.ts$/ },
  ],
  webServer: {
    command: `pnpm ${CI ? 'start' : 'dev'}`,
    url: baseURL,
    timeout: 1000 * 60 * 5,
    reuseExistingServer: !CI,
  },
})

import react from '@vitejs/plugin-react'

import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const resolve = (path: string) => new URL(path, import.meta.url).pathname

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    include: ['src/tests/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      reporter: ['lcov', 'html'],
      all: true,
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/dist/**',
        '**/coverage/**',
        '**/fixtures/**',
        '**/tests/**',
        './scripts/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})

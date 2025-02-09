import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['@tailwindcss/typography', 'sharp', 'tailwindcss', 'canvas-confetti', '@types/canvas-confetti', 'react-email', 'use-debounce'],
  entry: ['*.config.mjs', '*.config.mts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/*.ts'],
  ignore: ['**/*.d.ts', './src/components/base/*'],
}

export default config

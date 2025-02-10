import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['@tailwindcss/typography', 'sharp', 'tailwindcss', 'react-email', '@types/next-pwa'],
  entry: ['*.config.mjs', '*.config.mts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/*.ts'],
  ignore: ['./src/db/seed.ts', '**/*.d.ts', './src/components/base/*', './src/plugins/*'],
}

export default config

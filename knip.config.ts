import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    '@tailwindcss/typography',
    'sharp',
    'tailwindcss',
    'react-email',
    'lint-staged',
    'picocolors',
  ],
  entry: [
    '*.config.mjs',
    '*.config.mts',
  ],
  project: [
    'src/**/*.{ts,tsx}',
    'scripts/*.ts',
  ],
  ignore: [
    './scripts/verify-commit.ts',
    './src/db/seed.ts',
    './src/config/notes.ts',
    '**/*.d.ts',
    './src/components/base/*',
    './src/plugins/*',
  ],
}

export default config

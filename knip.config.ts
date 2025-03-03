import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    '@tailwindcss/typography',
    'content-collections',
    'sharp',
    'tailwindcss',
    'react-email',
    'lint-staged',
    'picocolors',
  ],
  entry: [
    'content.config.ts',
    '*.config.mjs',
    '*.config.ts',
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

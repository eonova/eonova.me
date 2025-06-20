import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    '@tailwindcss/typography',
    'sharp',
    'tailwindcss',
    'react-email',
    'picocolors',
  ],
  entry: [
    'content.config.ts',
    '*.config.mjs',
    '*.config.ts',
    'src/e2e/**/*.{setup,teardown}.ts',
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
    'src/components/modules/**/*.{ts,tsx}',
    'src/components/shared/**/*.{ts,tsx}',
    'src/utils/url-builder.ts',
  ],
}

export default config

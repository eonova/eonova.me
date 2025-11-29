import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    '@types/spotify-api',
    '@tailwindcss/typography',
    'tw-animate-css',
    'sharp',
    'tailwindcss',
    'react-email',
    'picocolors',
    'execa',
  ],
  ignoreBinaries: ['only-allow'],
  entry: ['content.config.ts', '*.config.mjs', '*.config.ts', 'src/e2e/**/*.{setup,teardown}.ts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/*.ts'],
  ignore: [
    './scripts/verify-commit.ts',
    './src/db/seed.ts',
    './src/db/reset.ts',
    './src/config/notes.ts',
    '**/*.d.ts',
    './src/components/base/*',
    './src/plugins/*',
    'src/components/modules/**/*.{ts,tsx}',
    'src/components/shared/**/*.{ts,tsx}',
    'src/utils/url-builder.ts',
    './src/hooks/use-intersection-observer.ts',
  ],
}

export default config

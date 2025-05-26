import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    'cn-fontsource-ding-talk-jin-bu-ti-regular',
    '@tailwindcss/typography',
    'sharp',
    'tailwindcss',
    'react-email',
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
    'src/components/modules/**/*.{ts,tsx}',
    'src/components/shared/**/*.{ts,tsx}',
    'src/utils/url-builder.ts',
  ],
}

export default config

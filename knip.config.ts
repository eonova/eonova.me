import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['@radix-ui/react-context', '@tailwindcss/typography', '@eslint/config-inspector', 'eslint-plugin-tailwindcss', 'prettier-plugin-*', 'sharp', 'tailwindcss'],
  entry: ['*.config.mjs', '*.config.mts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/*.ts'],
  ignore: ['**/*.d.ts'],
}

export default config

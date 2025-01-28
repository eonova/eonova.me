import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  stylistic: true,
  markdown: true,
  ignores: [
    './README.md',
    'components/base/*',
  ],
})

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
  rules: {
    'import/no-anonymous-default-export': 'off',
    'react-refresh/only-export-components': 'off',
    'node/prefer-global/process': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-array-index-key': 'off',
    'jsdoc/check-param-names': 'off',
    'react-dom/no-dangerously-set-innerhtml': 'off',
    'react/prefer-destructuring-assignment': 'off'
  },
  extends: [
    'plugin:@next/next/recommended',
  ],
})

import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  stylistic: {
    rules: {
      'css.lint.unknownAtRules': 'ignore',
    },
  },
  ignores: [
    'README.md',
    'components/base/*',
    './src/trpc/react.tsx',
    'data/*',
  ],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'react-refresh/only-export-components': 'off',
    'node/prefer-global/process': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-array-index-key': 'off',
    'jsdoc/check-param-names': 'off',
    'react-dom/no-dangerously-set-innerhtml': 'off',
    'react/prefer-destructuring-assignment': 'off',
    'react-web-api/no-leaked-event-listener': 'off',
    'react/no-unstable-default-props': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-dupe-disjunctions': 'off',
    'no-prototype-builtins': 'off',
    'no-console': 'off',
    'ts/no-redeclare': 'off',
  },
  extends: [
    'plugin:@next/next/recommended',
  ],
})

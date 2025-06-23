export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
}

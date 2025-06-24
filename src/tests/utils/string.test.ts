import { describe, expect, it } from 'vitest'

// Test string utility functions
describe('string utility functions', () => {
  describe('string manipulation', () => {
    it('should capitalize first letter', () => {
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
      expect(capitalize('')).toBe('')
      expect(capitalize('a')).toBe('A')
    })

    it('should convert to kebab case', () => {
      const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

      expect(toKebabCase('camelCase')).toBe('camel-case')
      expect(toKebabCase('PascalCase')).toBe('pascal-case')
      expect(toKebabCase('already-kebab')).toBe('already-kebab')
      expect(toKebabCase('simple')).toBe('simple')
    })

    it('should convert to camel case', () => {
      const toCamelCase = (str: string) =>
        str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

      expect(toCamelCase('kebab-case')).toBe('kebabCase')
      expect(toCamelCase('multi-word-string')).toBe('multiWordString')
      expect(toCamelCase('simple')).toBe('simple')
      expect(toCamelCase('already-camelCase')).toBe('alreadyCamelCase')
    })

    it('should truncate strings', () => {
      const truncate = (str: string, length: number) =>
        str.length > length ? `${str.slice(0, length)}...` : str

      expect(truncate('Hello World', 5)).toBe('Hello...')
      expect(truncate('Short', 10)).toBe('Short')
      expect(truncate('Exact', 5)).toBe('Exact')
      expect(truncate('', 5)).toBe('')
    })
  })

  describe('string validation', () => {
    it('should check if string is empty or whitespace', () => {
      const isEmpty = (str: string) => !str || str.trim().length === 0

      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ')).toBe(true)
      expect(isEmpty('\t\n')).toBe(true)
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty(' hello ')).toBe(false)
    })

    it('should validate email format', () => {
      const isEmail = (str: string) => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(str)

      expect(isEmail('test@example.com')).toBe(true)
      expect(isEmail('user.name@domain.co.uk')).toBe(true)
      expect(isEmail('invalid-email')).toBe(false)
      expect(isEmail('test@')).toBe(false)
      expect(isEmail('@example.com')).toBe(false)
    })

    it('should check if string contains only numbers', () => {
      const isNumeric = (str: string) => /^\d+$/.test(str)

      expect(isNumeric('123')).toBe(true)
      expect(isNumeric('0')).toBe(true)
      expect(isNumeric('123abc')).toBe(false)
      expect(isNumeric('')).toBe(false)
      expect(isNumeric('12.34')).toBe(false)
    })
  })

  describe('string formatting', () => {
    it('should format numbers with commas', () => {
      const formatNumber = (num: number) => num.toLocaleString()

      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(123)).toBe('123')
    })

    it('should pluralize words', () => {
      const pluralize = (word: string, count: number) => (count === 1 ? word : `${word}s`)

      expect(pluralize('item', 1)).toBe('item')
      expect(pluralize('item', 0)).toBe('items')
      expect(pluralize('item', 2)).toBe('items')
      expect(pluralize('post', 1)).toBe('post')
      expect(pluralize('post', 5)).toBe('posts')
    })

    it('should escape HTML characters', () => {
      const escapeHtml = (str: string) =>
        str.replace(/[&<>"']/g, (match) => {
          const escapeMap: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          }
          return escapeMap[match] || match
        })

      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      )
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World')
      expect(escapeHtml("It's a test")).toBe('It&#39;s a test')
    })
  })

  describe('string search and replace', () => {
    it('should highlight search terms', () => {
      const highlight = (text: string, term: string) =>
        text.replace(new RegExp(`(${term})`, 'gi'), '<mark>$1</mark>')

      expect(highlight('Hello World', 'world')).toBe('Hello <mark>World</mark>')
      expect(highlight('Test testing', 'test')).toBe('<mark>Test</mark> <mark>test</mark>ing')
      expect(highlight('No match', 'xyz')).toBe('No match')
    })

    it('should remove extra whitespace', () => {
      const normalizeWhitespace = (str: string) => str.replace(/\s+/g, ' ').trim()

      expect(normalizeWhitespace('  hello   world  ')).toBe('hello world')
      expect(normalizeWhitespace('line1\n\nline2')).toBe('line1 line2')
      expect(normalizeWhitespace('\t\ttest\t\t')).toBe('test')
    })
  })
})

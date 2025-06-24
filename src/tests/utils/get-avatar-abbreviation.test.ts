import { describe, expect, it } from 'vitest'
import { getAvatarAbbreviation } from '~/utils/get-avatar-abbreviation'

describe('getAvatarAbbreviation', () => {
  it('should return first letter of single word', () => {
    expect(getAvatarAbbreviation('John')).toBe('J')
    expect(getAvatarAbbreviation('Alice')).toBe('A')
    expect(getAvatarAbbreviation('Bob')).toBe('B')
  })

  it('should return first letters of two words', () => {
    expect(getAvatarAbbreviation('John Doe')).toBe('JD')
    expect(getAvatarAbbreviation('Alice Smith')).toBe('AS')
    expect(getAvatarAbbreviation('Bob Johnson')).toBe('BJ')
  })

  it('should return only first two letters for multiple words', () => {
    expect(getAvatarAbbreviation('John Michael Doe')).toBe('JM')
    expect(getAvatarAbbreviation('Alice Mary Smith Johnson')).toBe('AM')
    expect(getAvatarAbbreviation('A B C D E F')).toBe('AB')
  })

  it('should handle empty string', () => {
    expect(getAvatarAbbreviation('')).toBe('')
  })

  it('should handle single character names', () => {
    expect(getAvatarAbbreviation('A')).toBe('A')
    expect(getAvatarAbbreviation('X')).toBe('X')
  })

  it('should handle names with extra spaces', () => {
    expect(getAvatarAbbreviation('John  Doe')).toBe('JD')
    expect(getAvatarAbbreviation(' Alice Smith ')).toBe('AS')
    expect(getAvatarAbbreviation('Bob   Johnson   Wilson')).toBe('BJ')
  })

  it('should handle names with leading/trailing spaces', () => {
    expect(getAvatarAbbreviation(' John')).toBe('J')
    expect(getAvatarAbbreviation('Alice ')).toBe('A')
    expect(getAvatarAbbreviation(' Bob Doe ')).toBe('BD')
  })

  it('should handle lowercase names', () => {
    expect(getAvatarAbbreviation('john doe')).toBe('jd')
    expect(getAvatarAbbreviation('alice smith')).toBe('as')
  })

  it('should handle mixed case names', () => {
    expect(getAvatarAbbreviation('JoHn DoE')).toBe('JD')
    expect(getAvatarAbbreviation('aLiCe SmItH')).toBe('aS')
  })

  it('should handle special characters in names', () => {
    expect(getAvatarAbbreviation("John O'Connor")).toBe('JO')
    expect(getAvatarAbbreviation('Jean-Pierre Dupont')).toBe('JD')
    expect(getAvatarAbbreviation('Mary-Jane Watson')).toBe('MW')
  })

  it('should handle names with numbers', () => {
    expect(getAvatarAbbreviation('John2 Doe3')).toBe('JD')
    expect(getAvatarAbbreviation('User123 Test456')).toBe('UT')
  })

  it('should handle unicode characters', () => {
    expect(getAvatarAbbreviation('张三 李四')).toBe('张李')
    expect(getAvatarAbbreviation('José María')).toBe('JM')
    expect(getAvatarAbbreviation('François Müller')).toBe('FM')
  })

  it('should handle very long names', () => {
    const longName = 'Alexander Benjamin Christopher David Edward Francis George Henry'
    expect(getAvatarAbbreviation(longName)).toBe('AB')
  })

  it('should handle names with only spaces', () => {
    expect(getAvatarAbbreviation('   ')).toBe('')
    expect(getAvatarAbbreviation(' ')).toBe('')
  })

  it('should handle names with tabs and newlines', () => {
    // The current implementation only splits by space, so tabs/newlines are treated as part of the name
    expect(getAvatarAbbreviation('John\tDoe')).toBe('J')
    expect(getAvatarAbbreviation('Alice\nSmith')).toBe('A')
  })

  it('should be consistent with same input', () => {
    const name = 'John Doe'
    const result1 = getAvatarAbbreviation(name)
    const result2 = getAvatarAbbreviation(name)
    expect(result1).toBe(result2)
    expect(result1).toBe('JD')
  })

  it('should handle edge cases with empty words', () => {
    // This might happen with multiple consecutive spaces
    expect(getAvatarAbbreviation('John  Doe')).toBe('JD')
    expect(getAvatarAbbreviation('A   B   C')).toBe('AB')
  })

  it('should preserve case of original characters', () => {
    expect(getAvatarAbbreviation('john DOE')).toBe('jD')
    expect(getAvatarAbbreviation('ALICE smith')).toBe('As')
    expect(getAvatarAbbreviation('Bob JOHNSON wilson')).toBe('BJ')
  })
})

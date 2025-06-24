import { describe, expect, it } from 'vitest'
import { formatDate } from '~/utils/format-date'

describe('formatDate utility function', () => {
  it('should format recent dates with Chinese format', () => {
    const oldDate = new Date('2024-01-15T10:30:00Z')
    const result = formatDate(oldDate)
    expect(result).toMatch(/2024年1月15日|天前/)
  })

  it('should format date string', () => {
    const dateString = '2024-01-15'
    const result = formatDate(dateString)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should show "今天" for today', () => {
    const now = new Date()
    const result = formatDate(now)
    expect(result).toBe('今天')
  })

  it('should show relative days for recent dates', () => {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const result = formatDate(yesterday)
    expect(result).toMatch(/\d+ 天前/)
  })

  it('should handle timestamp numbers', () => {
    const timestamp = Date.now()
    const result = formatDate(timestamp)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should format old dates with full Chinese format', () => {
    const oldDate = new Date('2023-01-15T10:30:00Z')
    const result = formatDate(oldDate)
    expect(result).toMatch(
      /2023年[^\n\r\u2028\u2029\u6708]*\u6708[^\n\r\u2028\u2029\u65E5]*\u65E5.*星期/,
    )
  })

  it('should handle edge case dates', () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const result = formatDate(thirtyDaysAgo)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

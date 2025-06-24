import { describe, expect, it } from 'vitest'
import { range } from '~/utils/range'

describe('range utility function', () => {
  it('should create array with specified length starting from 0', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4])
    expect(range(3)).toEqual([0, 1, 2])
    expect(range(1)).toEqual([0])
  })

  it('should return empty array for length 0', () => {
    expect(range(0)).toEqual([])
  })

  it('should handle large numbers', () => {
    const result = range(100)
    expect(result).toHaveLength(100)
    expect(result[0]).toBe(0)
    expect(result[99]).toBe(99)
    expect(result[50]).toBe(50)
  })

  it('should create consecutive integers', () => {
    const result = range(10)
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(i)
    }
  })

  it('should handle edge case with length 1', () => {
    expect(range(1)).toEqual([0])
  })

  it('should return new array instance each time', () => {
    const result1 = range(3)
    const result2 = range(3)

    expect(result1).toEqual(result2)
    expect(result1).not.toBe(result2) // Different instances
  })

  it('should work with negative length (edge case)', () => {
    // Array.from with negative length should return empty array
    expect(range(-1)).toEqual([])
    expect(range(-5)).toEqual([])
  })

  it('should work with decimal length (edge case)', () => {
    // Array.from truncates decimal to integer
    expect(range(3.7)).toEqual([0, 1, 2])
    expect(range(2.1)).toEqual([0, 1])
  })

  it('should be useful for iteration patterns', () => {
    // Test common use case: creating elements for rendering
    const elements = range(3).map(i => `item-${i}`)
    expect(elements).toEqual(['item-0', 'item-1', 'item-2'])
  })

  it('should work with forEach pattern', () => {
    const results: number[] = []
    range(4).forEach(i => results.push(i * 2))
    expect(results).toEqual([0, 2, 4, 6])
  })

  it('should work with reduce pattern', () => {
    const sum = range(5).reduce((acc, curr) => acc + curr, 0)
    expect(sum).toBe(10) // 0 + 1 + 2 + 3 + 4 = 10
  })

  it('should work with filter pattern', () => {
    const evenNumbers = range(10).filter(i => i % 2 === 0)
    expect(evenNumbers).toEqual([0, 2, 4, 6, 8])
  })

  it('should work with find pattern', () => {
    const found = range(10).find(i => i > 5)
    expect(found).toBe(6)
  })

  it('should handle very large arrays efficiently', () => {
    const largeRange = range(10000)
    expect(largeRange).toHaveLength(10000)
    expect(largeRange[0]).toBe(0)
    expect(largeRange[9999]).toBe(9999)
  })

  it('should maintain array properties', () => {
    const result = range(5)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(5)
    expect(typeof result[0]).toBe('number')
  })

  it('should work with spread operator', () => {
    const result = [...range(3)]
    expect(result).toEqual([0, 1, 2])
  })

  it('should work with destructuring', () => {
    const [first, second, third] = range(5)
    expect(first).toBe(0)
    expect(second).toBe(1)
    expect(third).toBe(2)
  })

  it('should be immutable (not modify original)', () => {
    const result = range(3)
    const original = [...result]

    result.push(999) // Modify the result

    // Creating a new range should not be affected
    const newResult = range(3)
    expect(newResult).toEqual(original)
    expect(newResult).not.toEqual(result)
  })
})

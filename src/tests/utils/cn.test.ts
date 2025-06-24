import { describe, expect, it } from 'vitest'
import { cn } from '~/utils/cn'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'valid')).toBe('base valid')
  })

  it('should handle empty strings', () => {
    expect(cn('base', '', 'valid')).toBe('base valid')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })

  it('should handle objects with boolean values', () => {
    expect(
      cn({
        class1: true,
        class2: false,
        class3: true,
      }),
    ).toBe('class1 class3')
  })

  it('should merge Tailwind classes correctly (deduplication)', () => {
    // This tests the clsx + tailwind-merge functionality
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle complex combinations', () => {
    const result = cn(
      'base-class',
      {
        'conditional-class': true,
        'hidden-class': false,
      },
      ['array-class1', 'array-class2'],
      undefined,
      'final-class',
    )
    expect(result).toBe('base-class conditional-class array-class1 array-class2 final-class')
  })
})

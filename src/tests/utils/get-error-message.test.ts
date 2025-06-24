import { describe, expect, it } from 'vitest'
import { getErrorMessage } from '~/utils/get-error-message'

describe('getErrorMessage utility function', () => {
  it('should extract message from Error object', () => {
    const error = new Error('Test error message')
    expect(getErrorMessage(error)).toBe('Test error message')
  })

  it('should handle string errors', () => {
    const error = 'String error message'
    expect(getErrorMessage(error)).toBe('String error message')
  })

  it('should handle objects with message property', () => {
    const error = { message: 'Object error message' }
    expect(getErrorMessage(error)).toBe('Object error message')
  })

  it('should handle objects without message property', () => {
    const error = { error: 'Object error property' }
    expect(getErrorMessage(error)).toBe('Something went wrong')
  })

  it('should handle nested error objects without message', () => {
    const error = {
      response: {
        data: {
          error: 'Nested error message',
        },
      },
    }
    expect(getErrorMessage(error)).toBe('Something went wrong')
  })

  it('should handle unknown error types with fallback', () => {
    const error = { someProperty: 'value' }
    const result = getErrorMessage(error)
    expect(result).toBe('Something went wrong')
  })

  it('should handle null and undefined', () => {
    expect(getErrorMessage(null)).toBe('Something went wrong')
    expect(getErrorMessage(undefined)).toBe('Something went wrong')
  })

  it('should handle empty string', () => {
    expect(getErrorMessage('')).toBe('')
  })

  it('should handle numbers', () => {
    const result = getErrorMessage(404)
    expect(typeof result).toBe('string')
  })

  it('should handle arrays', () => {
    const error = ['Error 1', 'Error 2']
    const result = getErrorMessage(error)
    expect(typeof result).toBe('string')
  })
})

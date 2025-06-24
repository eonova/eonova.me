import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedCallback } from '~/hooks/use-debounced-callback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce function calls', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(mockFn, 500))

    // Call the debounced function multiple times
    act(() => {
      result.current('test1')
      result.current('test2')
      result.current('test3')
    })

    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled()

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Function should be called only once with the last argument
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test3')
  })

  it('should reset timer on subsequent calls', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(mockFn, 500))

    act(() => {
      result.current('test1')
    })

    // Advance time by 300ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Call again, should reset the timer
    act(() => {
      result.current('test2')
    })

    // Advance time by another 300ms (total 600ms, but timer was reset)
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Function should not be called yet
    expect(mockFn).not.toHaveBeenCalled()

    // Advance time by remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Now function should be called
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test2')
  })

  it('should handle different delay values', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(mockFn, 1000))

    act(() => {
      result.current('test')
    })

    // Advance time by 500ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockFn).not.toHaveBeenCalled()

    // Advance time by another 500ms (total 1000ms)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle function updates', () => {
    const mockFn1 = vi.fn()
    const mockFn2 = vi.fn()

    const { result, rerender } = renderHook(({ fn }) => useDebouncedCallback(fn, 500), {
      initialProps: { fn: mockFn1 },
    })

    act(() => {
      result.current('test1')
    })

    // Update the function
    rerender({ fn: mockFn2 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // The new function should be called
    expect(mockFn1).not.toHaveBeenCalled()
    expect(mockFn2).toHaveBeenCalledWith('test1')
  })

  it('should cleanup timer on unmount', () => {
    const mockFn = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(mockFn, 500))

    act(() => {
      result.current('test')
    })

    // Unmount before timer completes
    unmount()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Function should not be called after unmount
    expect(mockFn).not.toHaveBeenCalled()
  })
})

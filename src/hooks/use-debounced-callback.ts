import { useCallback, useEffect, useRef } from 'react'

import { useCallbackRef } from './use-callback-ref'

export function useDebouncedCallback<T extends (...args: never[]) => unknown>(callback: T, delay: number) {
  const handleCallback = useCallbackRef(callback)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        globalThis.clearTimeout(debounceTimerRef.current)
      }
    },
    [],
  )

  const setValue = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimerRef.current) {
        globalThis.clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = globalThis.setTimeout(() => handleCallback(...args), delay)
    },
    [handleCallback, delay],
  )

  return setValue
}

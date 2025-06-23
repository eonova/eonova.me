import { useEffect, useMemo, useRef } from 'react'

export function useCallbackRef<T extends (...args: never[]) => unknown>(
  callback: T | undefined,
): T {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

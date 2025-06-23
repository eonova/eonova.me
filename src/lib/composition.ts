import { useCallback } from 'react'

function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return (event: E) => {
    originalEventHandler?.(event)

    if (!checkForDefaultPrevented || !(event as unknown as Event).defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

type PossibleRef<T> = React.Ref<T> | undefined

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    return ref(value)
  }

  if (ref !== null && ref !== undefined) {
    ref.current = value
  }
}

function composeRefs<T>(...refs: Array<PossibleRef<T>>): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) setRef(ref, node)
  }
}

function useComposedRefs<T>(...refs: Array<PossibleRef<T>>): React.RefCallback<T> {
  return useCallback(composeRefs(...refs), refs)
}

export { composeEventHandlers, useComposedRefs }

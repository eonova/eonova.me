'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
  initialIsIntersecting?: boolean
}

interface UseIntersectionObserverReturn {
  elementRef: React.RefObject<HTMLElement | null>
  isIntersecting: boolean
  entry: IntersectionObserverEntry | null
}

/**
 * Intersection Observer Hook
 * 用于检测元素是否进入视口
 */
export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = false,
  skip = false,
  initialIsIntersecting = false,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn {
  const elementRef = useRef<HTMLElement>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting)

  const frozen = entry?.isIntersecting && triggerOnce

  const updateEntry = useCallback(([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry!)
    setIsIntersecting(entry!.isIntersecting)
  }, [])

  useEffect(() => {
    const element = elementRef.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !element || skip) {
      return
    }

    const observerParams = { threshold, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, threshold, rootMargin, frozen, skip, updateEntry])

  return {
    elementRef,
    isIntersecting,
    entry,
  }
}

/**
 * 多元素 Intersection Observer Hook
 */
export function useMultipleIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = false,
}: UseIntersectionObserverOptions = {}) {
  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const observe = useCallback(
    (element: Element) => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (observerEntries) => {
            setEntries((prev) => {
              const newEntries = new Map(prev)
              observerEntries.forEach((entry) => {
                newEntries.set(entry.target, entry)

                // 如果只触发一次且已经相交，则停止观察
                if (triggerOnce && entry.isIntersecting) {
                  observerRef.current?.unobserve(entry.target)
                }
              })
              return newEntries
            })
          },
          { threshold, rootMargin },
        )
      }

      observerRef.current.observe(element)
    },
    [threshold, rootMargin, triggerOnce],
  )

  const unobserve = useCallback((element: Element) => {
    observerRef.current?.unobserve(element)
    setEntries((prev) => {
      const newEntries = new Map(prev)
      newEntries.delete(element)
      return newEntries
    })
  }, [])

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect()
    setEntries(new Map())
  }, [])

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return {
    observe,
    unobserve,
    disconnect,
    entries,
  }
}

/**
 * 懒加载图片 Hook
 */
export function useLazyImage(src: string, options?: UseIntersectionObserverOptions) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  const { elementRef, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    ...options,
  })

  useEffect(() => {
    if (isIntersecting && !imageSrc) {
      setImageSrc(src)
    }
  }, [isIntersecting, src, imageSrc])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setIsError(false)
  }, [])

  const handleError = useCallback(() => {
    setIsError(true)
    setIsLoaded(false)
  }, [])

  return {
    elementRef,
    imageSrc,
    isLoaded,
    isError,
    isIntersecting,
    handleLoad,
    handleError,
  }
}

/**
 * 无限滚动 Hook
 */
export function useInfiniteScroll({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 1,
  rootMargin = '100px',
}: {
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
  threshold?: number
  rootMargin?: string
}) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
  })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    elementRef,
    isIntersecting,
  }
}

/**
 * 视口可见性 Hook
 * 用于暂停/恢复动画或视频
 */
export function useVisibility(options?: UseIntersectionObserverOptions) {
  const { elementRef, isIntersecting, entry } = useIntersectionObserver({
    threshold: 0.5,
    ...options,
  })

  const isVisible = isIntersecting
  const visibilityRatio = entry?.intersectionRatio ?? 0

  return {
    elementRef,
    isVisible,
    visibilityRatio,
    entry,
  }
}

/**
 * 滚动方向检测 Hook
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset
      const direction = scrollY > lastScrollY ? 'down' : 'up'

      if (
        direction !== scrollDirection
        && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction)
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0)
    }

    window.addEventListener('scroll', updateScrollDirection)
    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [scrollDirection, lastScrollY])

  return scrollDirection
}

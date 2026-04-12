import { useEffect, useState } from 'react'

/** 视为「到达顶部」的阈值（px），避免移动端超额滚出回弹时误判导致 header 不显示 */
const TOP_THRESHOLD = 10

interface ScrollState {
  isVisible: boolean
  isAtTop: boolean
}

/**
 * 监听滚动方向，判断是否到达顶部或滚动向下
 * @returns 滚动状态
 */
function useScrollDirection(): ScrollState {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [scrollState, setScrollState] = useState<ScrollState>({
    isVisible: true,
    isAtTop: true,
  })

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      const atTop = currentScrollPos <= TOP_THRESHOLD
      const isScrollingDown = currentScrollPos > prevScrollPos

      setScrollState({
        // 到达顶部时始终显示 header（解决移动端顶部回弹不显示的问题）
        isVisible: atTop || !isScrollingDown,
        isAtTop: atTop,
      })
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  return scrollState
}

export default useScrollDirection

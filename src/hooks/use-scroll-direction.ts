import { useEffect, useState } from 'react'

/** 视为「到达顶部」的阈值（px），避免移动端超额滚出回弹时误判导致 header 不显示 */
const TOP_THRESHOLD = 10

function useScrollDirection() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      const atTop = currentScrollPos <= TOP_THRESHOLD
      const isScrollingDown = currentScrollPos > prevScrollPos

      // 到达顶部时始终显示 header（解决移动端顶部回弹不显示的问题）
      setIsVisible(atTop || !isScrollingDown)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  return isVisible
}

export default useScrollDirection

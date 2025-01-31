import { useEffect, useState } from 'react'

function useScrollDirection() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      const isScrollingDown = currentScrollPos > prevScrollPos

      // 根据滚动方向设置 header 的显示状态
      setIsVisible(!isScrollingDown)
      setPrevScrollPos(currentScrollPos)
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll)

    // 组件卸载时移除滚动事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos])

  return isVisible
}

export default useScrollDirection

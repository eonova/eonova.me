'use client'

import type { LenisOptions } from 'lenis'
import type { LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { ReactLenis } from 'lenis/react'
import { useCallback, useEffect, useRef } from 'react'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef | null>(null)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)

  // 防抖处理的resize监听
  const handleResize = useCallback(() => {
    if (resizeTimeout.current)
      clearTimeout(resizeTimeout.current)
    resizeTimeout.current = setTimeout(() => {
      lenisRef.current?.lenis?.resize()
    }, 200) // 200ms防抖间隔
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis)
      return

    // 优化后的GSAP ticker绑定
    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    // 添加性能更好的被动事件监听
    window.addEventListener('resize', handleResize, { passive: true })
    gsap.ticker.add(update)

    // 滚动边界检测（防止无限滚动）
    const handleScroll = ({ scroll, limit }: any) => {
      const MARGIN = 50 // 边界检测余量
      const isAtTop = scroll <= MARGIN
      const isAtBottom = scroll >= limit - MARGIN

      if (isAtTop || isAtBottom) {
        lenis.stop()
        requestAnimationFrame(() => lenis.start())
      }
    }

    lenis.on('scroll', handleScroll)

    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('resize', handleResize)
      lenis.off('scroll', handleScroll)
      if (resizeTimeout.current)
        clearTimeout(resizeTimeout.current)
    }
  }, [handleResize])

  // 检测节点或其祖先是否为可滚动容器，若是则不让 Lenis 接管，保留原生局部滚动
  const preventLenisOnScrollable: LenisOptions['prevent'] = (node) => {
    let el: HTMLElement | null = node
    while (el && el !== document.body) {
      const { overflowY, overflowX } = getComputedStyle(el)
      const verticalScroll = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight
      const horizontalScroll = (overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth
      if (verticalScroll || horizontalScroll)
        return true
      el = el.parentElement
    }
    return false
  }

  // 优化后的Lenis配置
  const options: LenisOptions = {
    duration: 0.8,
    wheelMultiplier: 0.6, // 更保守的滚轮速度
    touchMultiplier: 0.8, // 适中的触摸速度
    smoothWheel: true,
    infinite: false, // 禁用无限滚动
    easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)), // 更高效的缓动函数
    orientation: 'vertical',
    prevent: preventLenisOnScrollable,
  }

  return (
    <ReactLenis root ref={lenisRef} options={options}>
      {children}
    </ReactLenis>
  )
}

'use client'

import type { LenisOptions } from 'lenis'
import type { LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef, useCallback } from 'react'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef | null>(null)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)

  // 防抖处理的resize监听
  const handleResize = useCallback(() => {
    if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
    resizeTimeout.current = setTimeout(() => {
      lenisRef.current?.lenis?.resize()
    }, 200) // 200ms防抖间隔
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis) return

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
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
    }
  }, [handleResize])

  // 优化后的Lenis配置
  const options: LenisOptions = {
    duration: 0.8,
    wheelMultiplier: 0.6,    // 更保守的滚轮速度
    touchMultiplier: 0.8,    // 适中的触摸速度
    smoothWheel: true,
    infinite: false,         // 禁用无限滚动
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 更高效的缓动函数
    orientation: 'vertical',
  }

  return (
    <ReactLenis root ref={lenisRef} options={options}>
      {children}
    </ReactLenis>
  )
}

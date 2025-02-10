'use client'

import gsap from 'gsap'
import type { LenisOptions } from 'lenis'
import { LenisRef, ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

interface LenisProviderProps {
  children: React.ReactNode
}

export const LenisProvider = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<LenisRef | null>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [])

  const option: LenisOptions = {
    duration: 0.35,
    wheelMultiplier: 0.7, // 调整鼠标滚轮速度
    touchMultiplier: 0.7, // 调整触摸滚动速度
    smoothWheel: true, // 启用鼠标滚轮平滑滚动
    easing: function easeOutSine(x: number): number {
      return Math.sin((x * Math.PI) / 2);
    }
  }

  return (
    <ReactLenis root options={option} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}


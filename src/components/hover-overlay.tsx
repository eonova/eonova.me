'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils'

export function HoverOverlay() {
  const [mouseEnter, setMouseEnter] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const $ref = ref.current
    if (!$ref) return

    const $parent = $ref.parentElement
    if (!$parent) return

    // 确保父元素可聚焦
    $parent.tabIndex = -1
    const handleFocus = () => setMouseEnter(true)
    const handleBlur = () => setMouseEnter(false)

    $parent.addEventListener('focus', handleFocus)
    $parent.addEventListener('blur', handleBlur)

    return () => {
      $parent.removeEventListener('focus', handleFocus)
      $parent.removeEventListener('blur', handleBlur)
    }
  }, [])

  return (
    <>
      <div ref={ref} className="absolute inset-0 z-10"
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)} />

      <AnimatePresence>
        {mouseEnter && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.3,
                delay: 0.1, // 添加微小延迟确保状态同步
                ease: [0.33, 1, 0.68, 1] // 改进的缓动曲线
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            className={cn(
              'absolute z-[5] rounded-xl',
              'bg-blue-200/30 dark:bg-neutral-800/80', // 增强可见性
              'inset-y-4 -left-4 -right-6',
              'backdrop-blur-[2px]' // 添加模糊效果辅助可视化
            )}
            style={{
              transformOrigin: 'left center', // 根据布局调整
              pointerEvents: 'none' // 确保不阻挡交互
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

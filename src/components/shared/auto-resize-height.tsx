'use client'

import type * as React from 'react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/utils'

interface AnimateChangeInHeightProps {
  children: React.ReactNode
  className?: string
  duration?: number

  spring?: boolean
}

export const AutoResizeHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
  duration = 0.6,
  spring = false,
}) => {
  const softSpringPreset = {
    duration: 0.35,
    type: 'spring' as const,
    stiffness: 120,
    damping: 20,
  }
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries[0]!.contentRect.height
        setHeight(observedHeight)
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        // Cleanup the observer when the component is unmounted
        resizeObserver.disconnect()
      }
    }
    // 兜底 return，确保所有路径都有返回值
    return void 0
  }, [])

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      style={{ height }}
      initial={false}
      animate={{ height }}
      transition={spring ? softSpringPreset : { duration }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  )
}

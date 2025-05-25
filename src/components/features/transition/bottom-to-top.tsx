'use client'

import type { ComponentProps, ElementType } from 'react'
import { motion } from 'motion/react'

type BottomToUpProps = {
  delay?: number
  as?: ElementType
} & ComponentProps<typeof motion.div>

export function BottomToUpTransitionView({
  delay = 0,
  as = 'div',
  className,
  children,
  ...props
}: BottomToUpProps) {
  const Component = motion(as)

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay / 1000,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

'use client'

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '~/lib/utils'

interface VelocityScrollProps {
  text: string
  default_velocity?: number
  className?: string
}

interface ParallaxProps {
  children: string
  baseVelocity: number
  className?: string
}

export function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}
export const VelocityScroll: React.FC<VelocityScrollProps> = ({
  text,
  default_velocity = 5,
  className,
}) => {
  // eslint-disable-next-line react/no-nested-components
  const ParallaxText: React.FC<ParallaxProps> = ({
    children,
    baseVelocity = 100,
    className,
  }) => {
    const baseX = useMotionValue(0)
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    })

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
      clamp: false,
    })

    const [repetitions, setRepetitions] = useState(1)
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      const calculateRepetitions = () => {
        if (containerRef.current && textRef.current) {
          const containerWidth = containerRef.current.offsetWidth
          const textWidth = textRef.current.offsetWidth
          const newRepetitions = Math.ceil(containerWidth / textWidth) + 2
          setRepetitions(newRepetitions)
        }
      }

      calculateRepetitions()

      window.addEventListener('resize', calculateRepetitions)
      return () => window.removeEventListener('resize', calculateRepetitions)
    }, [children])

    const x = useTransform(baseX, v => `${wrap(-100 / repetitions, 0, v)}%`)

    const directionFactor = useRef<number>(1)
    useAnimationFrame((_t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 2000)

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      }
      else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get()

      baseX.set(baseX.get() + moveBy)
    })

    return (
      <div
        className="w-full overflow-hidden whitespace-nowrap"
        ref={containerRef}
      >
        <motion.div className={cn('inline-block', className)} style={{ x }}>
          {Array.from({ length: repetitions }).map((_, i) => (
            <span key={i} ref={i === 0 ? textRef : null}>
              {children}
              {' '}
            </span>
          ))}
        </motion.div>
      </div>
    )
  }

  const locaityRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(locaityRef, { once: true, margin: '-100px' })
  return (
    <motion.div
      className="relative py-4 shadow-feature-card overflow-hidden flex flex-col justify-between border border-solid border-1 rounded-2xl col-span-1 md:col-span-4 lg:col-span-8"
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={locaityRef}
      transition={{
        duration: 0.5,
      }}
    >
      <ParallaxText baseVelocity={-default_velocity} className={className}>
        {text}
      </ParallaxText>
    </motion.div>
  )
}

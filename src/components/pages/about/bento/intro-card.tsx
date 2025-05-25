'use client'
import { motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '~/utils'

interface IntroCardProps {
  className?: string
  children?: React.ReactNode
  title?: string
  subheading?: string
  desc?: string
  spotlightColor?: string
  isColor?: boolean
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

const IntroCard: React.FC<IntroCardProps> = ({
  children,
  className,
  title,
  subheading,
  desc,
  spotlightColor = 'rgba(222, 255, 236, 0.106)',
  isColor = false,
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const isInView = useInView(divRef, { once: true, margin: '-100px' })
  const handleMouseMove = (e: { clientX: number, clientY: number }) => {
    if (!divRef.current || isFocused)
      return

    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(0.6)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(0.6)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }
  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      transition={{
        duration: 0.5,
      }}
      className={cn('overflow-hidden relative rounded-3xl p-6 px-8 border dark:border-white/10 border-black/5 shadow-feature-card dark:shadow-feature-card-dark font-world', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {subheading && <p className={cn('text-black/50 dark:text-white/60 text-sm', isColor ? 'text-white' : 'text-black/50 dark:text-white/80')}>{subheading}</p>}
      {title && <p className=" text-4xl mt-5">{title}</p>}
      {children}
      {desc && <p className={cn('absolute bottom-6', isColor ? 'text-white' : 'text-black/50 dark:text-white/80')}>{desc}</p>}
    </motion.div>
  )
}

export default IntroCard

'use client'
import { useRef, useState } from 'react'
import { cn } from '~/lib/utils'

interface IntroCardProps {
  className?: string
  children?: React.ReactNode
  title?: string
  subheading?: string
  desc?: string
  spotlightColor?: string
}

const IntroCard: React.FC<IntroCardProps> = ({
  children,
  className,
  title,
  subheading,
  desc,
  spotlightColor = 'rgba(31, 135, 76, 0.306)',
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
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
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('overflow-hidden relative p-6 px-8 rounded-xl border dark:border-white/10 border-black/5', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {subheading && <h4 className="text-white/60 font-mono text-[10px]">{subheading}</h4>}
      {title && <h3 className="font-world text-5xl mt-5">{title}</h3>}
      {children}
      {desc && <p className="text-white/80 font-mono absolute bottom-6">{desc}</p>}
    </div>
  )
}

export default IntroCard

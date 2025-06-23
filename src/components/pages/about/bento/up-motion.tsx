import { motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '~/utils/cn'

interface UpMotionProps {
  children: React.ReactNode
  className?: string
  setPosition: (position: { x: number, y: number }) => void
  setOpacity: (opacity: number) => void
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
const UpMotion: React.FC<UpMotionProps> = ({ className, children, setPosition, setOpacity }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

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
      className={cn(
        'shadow-feature-card dark:shadow-feature-card-dark font-world relative overflow-hidden rounded-3xl border border-black/5 p-6 px-8 dark:border-white/10',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export default UpMotion

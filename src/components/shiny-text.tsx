'use client'

import { cn } from '~/lib/utils'

interface ShinyTextProps {
  text: string
  title: string
  disabled?: boolean
  speed?: number
  className?: string
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, title, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`

  return (
    <div
      className={cn('text-black dark:text-[#b5b5b5a4] bg-clip-text inline-block', disabled && 'animate-shine', className)}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration,
      }}
      title={title}
    >
      {text}
    </div>
  )
}

export default ShinyText

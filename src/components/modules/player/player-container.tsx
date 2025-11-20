import { motion } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import { useClickOutside } from '~/hooks/use-click-outside'
import { cn } from '~/utils/cn'

interface MusicPlayerContainerProps {
  isVisible: boolean
  isPlaying: boolean
  children: React.ReactNode
  onClose: () => void
}

const MusicPlayerContainer: React.FC<MusicPlayerContainerProps> = ({
  isVisible,
  isPlaying,
  children,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 使用已经存在的 useClickOutside hook
  // 这个 hook 对 SVG 元素有更好的兼容性
  useClickOutside(containerRef, (_event) => {
    if (isVisible) {
      console.log('Click outside detected, closing player')
      onClose()
    }
  })

  return (
    <motion.div
      ref={containerRef}
      initial={{ x: '140%', opacity: 0 }}
      animate={{
        x: isVisible ? '0%' : '140%',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed right-17 bottom-5 z-50 w-[400px] bg-background/20 backdrop-blur-[10px] rounded-2xl shadow-2xl border border-gray-700/50 border-solid overflow-hidden player-info"
      onClick={e => e.stopPropagation()}
    >
      <Image
        src="/images/play_needle.png"
        className={cn('absolute z-10 origin-[20%_12%] duration-300', isPlaying ? '-rotate-35' : '-rotate-60')}
        height={34}
        width={51}
        alt=""
      />
      {children}
    </motion.div>
  )
}

export default MusicPlayerContainer

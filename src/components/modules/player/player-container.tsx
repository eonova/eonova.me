import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react' // 添加必要的导入
import { cn } from '~/utils/cn'

interface MusicPlayerContainerProps {
  isVisible: boolean // 改为小写boolean
  isPlaying: boolean
  children: React.ReactNode
  onClose: () => void // 添加关闭回调函数
}

const MusicPlayerContainer: React.FC<MusicPlayerContainerProps> = ({
  isVisible,
  isPlaying,
  children,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 点击外部隐藏组件的逻辑[1,2](@ref)
  useEffect(() => {
    if (!isVisible)
      return // 如果组件不可见，不需要监听

    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击是否发生在容器外部[1,2](@ref)
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
        event.stopPropagation() // 阻止事件冒泡[1](@ref)
      }
    }

    // 添加事件监听[1,2](@ref)
    document.addEventListener('click', handleClickOutside)

    // 清理函数：移除事件监听[1,2](@ref)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isVisible, onClose]) // 依赖项：当isVisible或onClose变化时重新绑定

  return (
    <motion.div
      ref={containerRef} // 添加ref引用
      initial={{ x: '140%', opacity: 0 }}
      animate={{
        x: isVisible ? '0%' : '140%',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed right-17 bottom-5 z-50 w-[400px] bg-background/20 backdrop-blur-[10px] rounded-2xl shadow-2xl border border-gray-700/50 border-solid overflow-hidden player-info"
      // 阻止容器内部点击事件冒泡到document[5](@ref)
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

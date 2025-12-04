'use client'

import { ArrowUp, MessageCircle, Music, PlayCircle, StopCircle } from 'lucide-react'
import { motion } from 'motion/react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { usePlaylistSongs } from '~/hooks/queries/music.query'
import { useMusicPlay } from '~/hooks/use-music-play'
import { cn } from '~/utils'

const MusicPlayer = dynamic(() => import('./music-player'), { ssr: false })

interface DockProps {
  className?: string
}

const Dock: React.FC<DockProps> = ({ className }) => {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const { isPlaying, setIsPlaying } = useMusicPlay()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isPlayerVisible, setPlayerIsVisible] = useState<boolean>(false)
  const pathname = usePathname()

  // 音乐数据获取
  const { data: playlistSongs } = usePlaylistSongs()

  useEffect(() => {
    const handleScroll = () => {
      // 显示/隐藏 dock - 添加缓冲区以避免抖动
      const threshold = 50
      if (window.scrollY > threshold) {
        setIsVisible(true)
      }
      else {
        setIsVisible(false)
      }

      // 计算滚动百分比
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const percentage = Math.min(Math.round((window.scrollY / scrollHeight) * 100), 100)
      setScrollPercentage(percentage)
    }

    // 初始化时执行一次以设置正确的状态
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToCommentSection = () => {
    const commentSection = document.getElementById('comment')
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.ul
        className={cn(
          'fixed right-5 bottom-5 hidden rounded-lg text-slate-700 duration-200 lg:flex items-center gap-1 py-1.5 flex-col dark:bg-[#222427]/30 dark:text-white bg-white backdrop-blur-[20px] shadow-lg w-9',
          className,
        )}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <li
          className={cn(
            'cursor-pointer p-1.5 rounded-md transition-colors text-[#7D4854] hover:text-black dark:hover:text-white',
          )}
          onClick={() => setPlayerIsVisible(!isPlayerVisible)}
        >
          <Music className="size-5 text-[#7D4854]" />
        </li>
        <li
          className={cn(
            'cursor-pointer p-1.5 rounded-md transition-colors text-[#7D4854] hover:text-black dark:hover:text-white',
          )}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying
            ? (
                <StopCircle className="size-5" />
              )
            : (
                <PlayCircle className="size-5" />
              )}
        </li>
        {pathname.match(/\/posts\//g)?.length === 1 && (
          <li
            className="cursor-pointer p-1.5 rounded-md transition-colors text-[#7D4854] hover:text-black dark:hover:text-white"
            onClick={goToCommentSection}
          >
            <MessageCircle className="size-5" />
          </li>
        )}
        {
          isVisible && (
            <li
              className="cursor-pointer p-1.5 rounded-md transition-colors relative group flex flex-col gap-0.5 items-center hover:text-black dark:hover:text-white text-[#7D4854]"
              onClick={scrollToTop}
              title="回到顶部"
            >
              <ArrowUp className="size-5" />
              <span className="text-[0.625rem] text-center font-medium">
                {scrollPercentage}
                %
              </span>
            </li>
          )
        }
      </motion.ul>
      <MusicPlayer
        onClose={() => {
          setPlayerIsVisible(false)
        }}
        isVisible={isPlayerVisible}
        songs={playlistSongs}
      />
    </>
  )
}

export default Dock

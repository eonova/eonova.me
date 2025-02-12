'use client'

import { motion } from 'framer-motion'
import { ArrowUp, MessageCircle, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'

interface DockProps {
  className?: string
}

const Dock: React.FC<DockProps> = ({
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsVisible(true)
      }
      else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // 定义函数，用于点击时跳转到评论区
  const goToCommentSection = () => {
    const commentSection = document.getElementById('comment')
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' }) // 平滑滚动
    }
  }

  return (
    <>
      <motion.div
        className={
          cn('fixed right-3 bottom-25 rounded-full text-slate-700 dark:text-white bg-black/5 dark:bg-gray-300/10 duration-200 hidden lg:block', !isVisible && 'opacity-0', className)
        }
        initial={{ x: '120%' }}
        animate={{ x: isVisible ? '0%' : '120%' }}
        transition={{ duration: 0.3 }}
      >
        <ul className="flex flex-col justify-between items-center w-full h-full p-1.5 gap-1">
          <li
            className="dark:bg-white/10 cursor-pointer rounded-full p-1.5"
            onClick={scrollToTop}
          >
            <ArrowUp className="size-5" />
          </li>
          <li
            className="dark:bg-white/10 cursor-pointer rounded-full p-1.5"
            onClick={toggleTheme}
          >
            <SunIcon
              className="size-5 dark:hidden"
            />
            <MoonIcon
              className="hidden size-5 dark:block"
            />
          </li>
          {
            pathname.match(/\/blog\//g)?.length === 1 && (
              <li
                className="dark:bg-white/10 cursor-pointer rounded-full p-1.5"
                onClick={goToCommentSection}
              >
                <MessageCircle
                  className="size-5"
                />
              </li>
            )
          }
        </ul>
        {/* Content for the top motion.div */}
      </motion.div>
    </>
  )
}
export default Dock

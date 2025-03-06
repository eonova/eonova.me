'use client'

import { ArrowUp, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '~/utils'

interface DockProps {
  className?: string
}

const Dock: React.FC<DockProps> = ({
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
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

  const goToCommentSection = () => {
    const commentSection = document.getElementById('comment')
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' })
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
          {
            pathname.match(/\/posts\//g)?.length === 1 && (
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
      </motion.div>
    </>
  )
}
export default Dock

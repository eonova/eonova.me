'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import useIsScroll from '~/hooks/use-is-scroll'
import useScrollDirection from '~/hooks/use-scroll-direction'
import { cn } from '~/lib/utils'
import { Separator } from '../base/separator'
import CommandMenu from '../command-menu'
import Avatar from '../avatar'
import MobileNav from './mobile-nav'
import Navbar from './navbar'
import ThemeToggle from './theme-switcher'
import '~/styles/page/header.css'
import { Rss } from 'lucide-react'
import { Button } from '../base'
import { SvgLogo } from '../logo'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const isVisible = useScrollDirection()
  const isScrolled = useIsScroll()

  const headerVariants = {
    // 初始加载状态
    initial: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
    // 可见且未滚动状态
    visible: {
      y: 0,
      opacity: 1,
      top: '16px',
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
    // 滚动后隐藏状态
    hidden: {
      y: -100, // 可以调整隐藏时的偏移量
      opacity: 0.7, // 可以调整隐藏时的透明度
      top: '-50px',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },

  }
  return (
    <motion.header
      variants={headerVariants}
      className={cn(
        'bg-background/30 inset-x-0 top-4 z-50 flex h-[50px] sm:h-[55px] max-w-5xl items-center justify-between rounded-full px-5 sm:px-8 mx-4 sm:mx-auto shadow-sm backdrop-blur-[10px] transition-colors fixed dark:border dark:border-solid dark:border-slate-600/50 during-300',
        isScrolled && 'bg-background/80',
        className,
      )}
      id="header"
      initial="initial"
      animate={!isVisible ? 'hidden' : 'visible'}
    >
      <Link className="h-full flex items-center" href="/" aria-label="回到首页" passHref>
        <SvgLogo className="h-8 w-8 sm:h-10 sm:w-10 mr-5" />
      </Link>

      <div className="flex items-center gap-2">
        <Navbar />
        <Separator orientation="vertical" className={cn('h-6 sm:block hidden')} />
        <Link target='black' href='/rss.xml'>
          <Button
            variant='ghost'
            className='size-9 p-0 rounded-full outline-0 focus-visible:outline-none border-0 cursor-pointer duration-200'
            aria-label='RSS订阅'
            data-testid='rss'
          >
            <Rss className='size-4' />
          </Button>
        </Link>
        <ThemeToggle />
        <CommandMenu />
        <MobileNav />
      </div>
    </motion.header>
  )
}

export default Header

'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { memo } from 'react'
import useIsScroll from '~/hooks/use-is-scroll'
import useScrollDirection from '~/hooks/use-scroll-direction'
import { cn } from '~/utils'
import { Separator } from '../base/separator'
import CommandMenu from '../command-menu'
import { SvgLogo } from '../logo'
import MobileNav from './mobile-nav'
import Navbar from './navbar'
import ThemeToggle from './theme-switcher'
import '~/styles/page/header.css'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const isVisible = useScrollDirection()
  const isScrolled = useIsScroll()

  const headerVariants = {
    initial: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      top: '16px',
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
    hidden: {
      y: -100,
      opacity: 0.7,
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
        'bg-background/30 inset-x-0 top-4 z-50 flex h-[50px] sm:h-[60px] max-w-[820px] items-center justify-between rounded-full px-5 sm:px-8 mx-4 sm:mx-auto shadow-xs backdrop-blur-[10px] transition-colors fixed dark:border dark:border-solid dark:border-slate-600/50 during-300',
        isScrolled && 'bg-background/80',
        className,
      )}
      id="header"
      initial="initial"
      animate={!isVisible ? 'hidden' : 'visible'}
    >
      <Link className="h-full flex items-center" href="/" aria-label="回到首页" passHref>
        <SvgLogo className="h-8 w-8 sm:h-9 sm:w-9 mr-5 hover:scale-105 duration-300 transform-cpu transform-view" />
      </Link>

      <div className="flex items-center gap-2 sm:gap-1">
        <Navbar />
        <Separator orientation="vertical" className={cn('h-6 mx-1 sm:block hidden')} />
        <ThemeToggle />
        <CommandMenu />
        <MobileNav />
      </div>
    </motion.header>
  )
}

export default memo(Header)

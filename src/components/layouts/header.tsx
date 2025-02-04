'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import useIsScroll from '~/hooks/use-is-scroll'
import useScrollDirection from '~/hooks/use-scroll-direction'
import { cn } from '~/lib/utils'
import { Separator } from '../base/separator'
import CommandMenu from '../command-menu'
import Logo from '../logo'
import MobileNav from './mobile-nav'
import Navbar from './navbar'
import ThemeToggle from './theme-toggle'
import '~/styles/header.css'

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
        ease: 'easeOut',
      },
    },
    // 可见且未滚动状态
    visible: {
      y: 0,
      opacity: 1,
      top: '10px',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    // 滚动后隐藏状态
    hidden: {
      y: -20, // 可以调整隐藏时的偏移量
      opacity: 0.8, // 可以调整隐藏时的透明度
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
        'bg-background/30 inset-x-0 top-4 z-50 flex h-[50px] max-w-5xl items-center justify-between rounded-full px-5 sm:px-8 mx-4 md:mx-auto shadow-sm backdrop-blur-[10px] transition-colors fixed dark:border dark:border-solid dark:border-slate-600/50 ',
        isScrolled && 'bg-background/80',
        className,
      )}
      id="header"
      initial="initial"
      animate={!isVisible ? 'hidden' : 'visible'}
    >
      <Link className="h-full flex items-center" href="/" passHref>
        <Logo className="-mr-5 sm:mr-0" />
      </Link>

      <div className="flex items-center gap-2">
        <Navbar />
        <Separator orientation="vertical" className={cn('h-6 sm:block hidden')} />
        <ThemeToggle />
        <CommandMenu />
        <MobileNav />
      </div>
    </motion.header>
  )
}

export default Header

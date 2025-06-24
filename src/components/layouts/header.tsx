'use client'

import { easeIn, easeOut, motion } from 'motion/react'
import Link from 'next/link'
import { memo } from 'react'
import { Separator } from '~/components/base/separator'
import useIsScroll from '~/hooks/use-is-scroll'
import useScrollDirection from '~/hooks/use-scroll-direction'
import { flags } from '~/lib/env'
import '~/styles/page/header.css'
import { cn } from '~/utils'
import { SvgLogo } from '../shared/logo'
import MobileNav from './mobile-nav'
import Navbar from './navbar'
import Search from './search'
import ThemeSwitcher from './theme-switcher'
import UserAuth from './user-auth'

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
        ease: easeIn,
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      top: '16px',
      transition: {
        duration: 0.4,
        ease: easeIn,
      },
    },
    hidden: {
      y: -100,
      opacity: 0.7,
      top: '-50px',
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  }

  return (
    <motion.header
      variants={headerVariants}
      className={cn(
        'bg-background/30 during-300 fixed inset-x-0 top-4 z-50 mx-4 flex h-[50px] max-w-[820px] items-center justify-between rounded-full px-5 shadow-xs backdrop-blur-[10px] transition-colors sm:mx-auto sm:h-[60px] sm:px-8 dark:border dark:border-solid dark:border-slate-600/50',
        isScrolled && 'bg-background/80',
        className,
      )}
      id="header"
      initial="initial"
      animate={!isVisible ? 'hidden' : 'visible'}
    >
      <Link className="flex h-full items-center" href="/" aria-label="回到首页" passHref>
        <SvgLogo className="mr-5 h-8 w-8 transform-cpu duration-300 transform-view hover:scale-105 sm:h-9 sm:w-9" />
      </Link>

      <div className="flex items-center gap-2 sm:gap-1">
        <Navbar />
        <Separator orientation="vertical" className={cn('mx-1 hidden h-6 sm:block')} />
        <ThemeSwitcher />
        {flags.search && <Search />}
        <MobileNav />
        <UserAuth />
      </div>
    </motion.header>
  )
}

export default memo(Header)

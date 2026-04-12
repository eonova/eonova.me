'use client'
import { easeIn, easeOut, motion } from 'motion/react'
import Link from 'next/link'
import { memo } from 'react'
import useScrollDirection from '~/hooks/use-scroll-direction'
import { cn } from '~/utils'
import Logo from '../shared/logo'
import { CommandMenu } from './internal/command-menu'
import ThemeSwitcher from './internal/theme-switcher'
import Navbar from './navbar'
import '~/styles/page/header.css'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { isVisible } = useScrollDirection()

  const headerVariants = {
    initial: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: easeIn,
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      top: '16px',
      transition: {
        duration: 0.3,
        ease: easeIn,
      },
    },
    hidden: {
      y: -100,
      opacity: 1,
      top: '-50px',
      transition: {
        duration: 0.2,
        ease: easeOut,
      },
    },
  }

  return (
    <motion.header
      variants={headerVariants}
      className={cn(
        'hidden sm:flex fixed inset-x-0 top-4 z-50 mx-4 h-[50px] max-w-[905px] items-center justify-between rounded-full sm:mx-auto sm:h-[62px] bg-background/30 shadow-xs backdrop-blur-md transition-colors data-[scrolled=true]:bg-background/80',
        className,
      )}
      initial="initial"
      animate={!isVisible ? 'hidden' : 'visible'}
    >
      <div className="w-full flex items-center justify-between px-6">
        <Link className="w-32 flex h-full items-center" href="/" aria-label="回到首页" passHref>
          <Logo className="mr-5 size-8 transform-cpu duration-300 transform-view hover:scale-105 sm:size-11" />
        </Link>
        <Navbar />

        <div className="flex w-32 items-center justify-end gap-2 sm:gap-3">
          <ThemeSwitcher />
          <CommandMenu />
        </div>
      </div>
    </motion.header>
  )
}

export default memo(Header)

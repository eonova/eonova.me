'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Separator } from '../base/separator'
import Logo from '../logo'
import MobileNav from './mobile-nav'
import Navbar from './navbar'
import ThemeToggle from './theme-toggle'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      }
      else {
        setIsScrolled(false)
      }
    }

    document.addEventListener('scroll', changeBackground)

    return () => {
      document.removeEventListener('scroll', changeBackground)
    }
  }, [])
  return (
    <motion.header
      className={cn(
        'bg-background/30 fixed inset-x-0 top-4 z-40 flex h-[40px] sm:h-[50px] max-w-5xl items-center justify-between rounded-full px-5 sm:px-8 mx-4 md:mx-auto shadow-sm saturate-100 backdrop-blur-[10px] transition-colors',
        isScrolled && 'bg-background/80',
        className,
      )}
      initial={{
        y: -100,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <Link className="h-full" href="/" passHref>
        <Logo className="-mr-5 sm:mr-0" />
      </Link>

      <div className="flex items-center gap-2">
        <Navbar />
        <Separator orientation="vertical" className={cn("h-6 sm:block hidden")} />
        <ThemeToggle />
        <MobileNav />
      </div>
    </motion.header>
  )
}

export default Header

'use client'
import { easeOut, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import useScrollDirection from '~/hooks/use-scroll-direction'
import GlassSurface from '../shared/glass-surface'
import { CommandMenu } from './internal/command-menu'
import ThemeSwitcher from './internal/theme-switcher'
import MobileNav from './mobile-nav'

function MobileHeader() {
  const { isVisible } = useScrollDirection()
  const [headerWidth, setHeaderWidth] = useState<number | '100%'>('100%')
  const { theme } = useTheme()
  useEffect(() => {
    const updateWidth = () => {
      // 屏幕宽度减去两边边距，移动端下我们保持满宽或留一点间距都可以，这里我们以减去两边 32px 的安全距离计算
      const safeWidth = window.innerWidth - 16
      setHeaderWidth(safeWidth)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const mobileHeaderVariants = {
    initial: {
      y: -100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      top: '10px',
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
      variants={mobileHeaderVariants}
      className="fixed inset-x-0 z-50 items-center justify-between sm:hidden flex mx-2.5"
      initial="initial"
      animate={!isVisible ? 'hidden' : 'visible'}
    >
      <GlassSurface
        borderRadius={24}
        borderWidth={0.08}
        brightness={70}
        opacity={0.95}
        blur={16}
        displace={1}
        width={headerWidth}
        height={52}
      >
        <div className="w-full flex items-center justify-between px-3.5">
          <Link className="flex h-full items-center font-serif text-lg font-bold ml-[-6]" href="/" aria-label="回到首页" passHref>
            <Image
              className={theme === 'dark' ? '' : 'hidden'}
              src="/images/logo-text-white.png"
              alt="花流尘"
              width={80}
              height={45}
            />
            <Image
              className={theme === 'dark' ? 'hidden' : ''}
              src="/images/logo-text-black.png"
              alt="花流尘"
              width={80}
              height={45}
            />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <CommandMenu />
            <MobileNav />
          </div>
        </div>
      </GlassSurface>
    </motion.header>
  )
}

export default memo(MobileHeader)

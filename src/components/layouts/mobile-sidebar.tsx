'use client'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react' // 引入 useEffect
import { HEADER_LINKS } from '~/config/links'
import { cn } from '~/lib/utils'
import { useNav } from '~/stores/nav'
import { Separator } from '../base/separator'

interface MobileNavAsideProps {
  className?: string
}

const sidebarVariants = {
  open: { x: 0, transition: { duration: 0.2 } },
  closed: { x: '-100%', transition: { duration: 0.2 } },
}

const MobileNavAside: React.FC<MobileNavAsideProps> = ({ className }) => {
  const navStore = useNav()
  const pathname = usePathname()

  // 监听侧边栏状态，动态设置 body 的 overflow
  useEffect(() => {
    if (navStore.isVisible) {
      document.body.style.overflow = 'hidden' // 禁止滚动
    }
    else {
      document.body.style.overflow = 'auto' // 恢复滚动
    }

    // 组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [navStore.isVisible])

  // 点击链接时关闭侧边栏
  const handleLinkClick = () => {
    navStore.setIsVisible() // 关闭侧边栏
  }

  return (
    <>
      {/* 侧边栏 */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cn-fontsource-ding-talk-jin-bu-ti-regular/font.css"></link>
      <motion.aside
        initial={false}
        animate={navStore.isVisible ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={cn(
          `fixed top-0 z-[999] h-screen bg-white dark:bg-gray-800 w-[80vw] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 sm:hidden px-10`,
          className,
        )}
      >
        <button
          type="button"
          className="absolute top-8 right-8 z-50 rounded-md md:hidden"
          onClick={() => navStore.setIsVisible()}
          aria-label="Close menu"
        >
          <X className="text-3xl" />
        </button>
        <div className="p-8 px-2 pt-16 flex gap-6 items-center">
          <Image
            src="/favicon/apple-touch-icon.png"
            className="rounded-full"
            width={70}
            height={70}
            alt="LeoStar"
          />
          <div className="flex flex-col gap-2">
            <h3 className="font-world text-3xl">LeoStar</h3>
            <h4 className="text-gray-600/80 dark:text-white/50">一个爱捣鼓的前端</h4>
          </div>
        </div>
        <Separator className="mx-auto" />
        <ul className="w-full my-5">
          {HEADER_LINKS.map((link) => {
            const isActive = link.href === pathname

            return (
              <li
                key={link.key}
                className="relative flex flex-col h-[50px] items-start justify-center"
              >
                <Link
                  className={cn(
                    'px-2 w-full bg-white/10 dark:bg-transparent font-medium transition-colors flex items-center text-[15px] gap-8',
                    {
                      'text-muted-foreground hover:text-foreground': !isActive,
                    },
                    {
                      'text-foreground': isActive,
                    },
                  )}
                  href={link.href}
                  onClick={handleLinkClick} // 点击链接时关闭侧边栏
                >
                  {link.icon}
                  {link.text}
                </Link>
              </li>
            )
          })}
        </ul>
        <Separator className="mx-auto" />

      </motion.aside>

      {/* 遮罩层 */}
      {navStore.isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[998] bg-black sm:hidden"
          onClick={() => navStore.setIsVisible()} // 点击遮罩层时关闭侧边栏
        />
      )}
    </>
  )
}

export default MobileNavAside

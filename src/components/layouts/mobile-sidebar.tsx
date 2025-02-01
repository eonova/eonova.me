'use client'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HEADER_LINKS } from '~/config/links'
import { cn } from '~/lib/utils'
import { useNav } from '~/stores/nav'

interface MobileNavAsideProps {
  className?: string
}

const sidebarVariants = {
  open: { x: 0, transition: { duration: 0.3 } },
  closed: { x: '-100%', transition: { duration: 0.3 } },
}

const MobileNavAside: React.FC<MobileNavAsideProps> = ({ className }) => {
  const navStore = useNav()
  const pathname = usePathname()
  return (
    <>
      <motion.aside
        initial={false}
        animate={navStore.isVisible ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={cn(`fixed top-0 z-[999] h-screen bg-gray-800 text-white w-96 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`, className)}
      >
        <button
          className="fixed top-5 left-5 z-50 bg-gray-800 text-white rounded-md md:hidden"
          onClick={navStore.setIsVisible}
        >
          <X />
        </button>
        <div className="p-10 pt-16 flex justify-center">
          <Image
            src="/images/avatar.png"
            className="rounded-full"
            width={100}
            height={100}
            alt="LeoStar"
          />
        </div>
        <ul className="w-full px-10">
          {HEADER_LINKS.map((link) => {
            const isActive = link.href === pathname

            return (
              <li
                key={link.key}
                className="relative flex flex-col h-[60px] items-center justify-center"
              >
                <Link
                  className={cn(
                    'rounded-lg px-3 py-4 text-xl w-full bg-white/10   font-medium transition-colors text-center',
                    {
                      'text-muted-foreground hover:text-foreground': !isActive,
                    },
                    {
                      'text-foreground': isActive,
                    },
                  )}
                  href={link.href}
                >
                  {link.text}
                </Link>
              </li>
            )
          })}
        </ul>
      </motion.aside>
      {/* 添加一个遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: navStore.isVisible ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn('fixed inset-0 z-80 bg-black', !navStore.isVisible && 'hidden')}
        onClick={navStore.setIsVisible}
      />
    </>
  )
}

export default MobileNavAside

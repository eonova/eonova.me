import type { IHeaderMenu } from '~/config/links'
import { motion } from 'motion/react'
import Link from 'next/link'
import { memo } from 'react'
import useIsScroll from '~/hooks/use-is-scroll'
import { cn } from '~/lib/utils'

const animationConfig = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

interface MenuPopoverProps {
  link: IHeaderMenu
  isOpen: boolean
}

const MenuPopover = memo(({ link, isOpen }: MenuPopoverProps) => {
  const isScrolled = useIsScroll()

  return (
    <motion.div
      data-key={link.key}
      initial="hidden"
      animate={isOpen ? 'visible' : 'exit'}
      variants={animationConfig}
      transition={{ duration: 0.3 }}
      id="nav"
      className={cn(
        'rounded-full bg-background/30 absolute left-1/2 top-full z-50 -translate-x-1/2 transition-colors backdrop-blur-[10px] shadow-sm during-300 dark:border dark:border-solid dark:border-slate-600/50',
        isScrolled && 'bg-background/80',
      )}
    >
      <div className="inset-x-0 flex gap-1 p-2">
        {link.subMenu?.map(subItem => (
          <Link
            key={subItem.key}
            href={subItem.href}
            className="hover:bg-gray-400/20 dark:hover:bg-accent hover:text-accent-foreground w-full flex items-center gap-4 rounded-full px-3 py-2 duration-200"
          >
            {subItem.icon}
            <p className="flex-1 whitespace-nowrap text-sm">{subItem.text}</p>
          </Link>
        ))}
      </div>
    </motion.div>
  )
})

MenuPopover.displayName = 'MenuPopover'
export default MenuPopover

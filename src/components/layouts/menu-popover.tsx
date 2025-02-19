import Link from 'next/link'
import { motion } from 'framer-motion'
import { memo } from 'react'
import type { IHeaderMenu } from '~/config/links'

const animationConfig = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

interface MenuPopoverProps {
  link: IHeaderMenu
  isOpen: boolean
}

const MenuPopover = memo(({ link, isOpen }: MenuPopoverProps) => (
  <motion.div
    data-key={link.key}
    initial="hidden"
    animate={isOpen ? 'visible' : 'exit'}
    variants={animationConfig}
    transition={{ duration: 0.15 }}
    className="absolute left-1/2 top-full z-50 -translate-x-1/2 transform"
    aria-hidden={!isOpen}
  >
    <div className="shadow-feature-card bg-popover flex flex-col gap-2 rounded-2xl p-2">
      {link.subMenu?.map((subItem) => (
        <Link
          key={subItem.key}
          href={subItem.href}
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-4 rounded-xl px-4 py-2 duration-200"
        >
          {subItem.icon}
          <p className="whitespace-nowrap rounded-md text-sm">{subItem.text}</p>
        </Link>
      ))}
    </div>
  </motion.div>
))

MenuPopover.displayName = 'MenuPopover'
export default MenuPopover

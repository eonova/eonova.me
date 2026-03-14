'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/base'
import { HEADER_LINKS } from '~/config/links'
import { useNav } from '~/hooks/use-nav'

function MobileNavAside() {
  const navStore = useNav()

  useEffect(() => {
    if (navStore.isVisible) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [navStore.isVisible])

  const handleLinkClick = () => {
    navStore.setIsVisible()
  }

  const iconWrapClassName = 'flex size-5 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground text-white'

  return (
    <Drawer open={navStore.isVisible} onOpenChange={handleLinkClick} direction="bottom">
      <DrawerContent className="max-h-[90vh] h-[90vh] rounded-t-2xl border-t-2">
        <DrawerHeader className="sr-only">
          <DrawerTitle>导航菜单</DrawerTitle>
          <DrawerDescription>网站导航链接</DrawerDescription>
        </DrawerHeader>
        <nav className="text-white flex w-full mt-10 flex-col items-stretch gap-8 text-left" aria-label="主导航">
          {HEADER_LINKS.map((link) => {
            const hasSub = link.subMenu && link.subMenu.length > 0

            if (hasSub) {
              return (
                <div key={link.key} className="flex flex-col gap-8">
                  <div className="flex w-full items-center justify-start gap-2.5 px-1 text-left">
                    {link.icon && (
                      <div className={iconWrapClassName}>
                        {link.icon}
                      </div>
                    )}
                    <h3 className="text-left text-sm font-semibold text-foreground transition-colors text-[16px]">
                      {link.text}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8 ml-5">
                    {link.subMenu!.map(sub => (
                      <Link
                        key={sub.key}
                        href={sub.href === '#' ? '#' : (sub.href as string)}
                        onClick={handleLinkClick}
                      >
                        <span className="truncate  text-[15px]">{sub.text}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={link.key}
                href={link.href === '#' ? '#' : (link.href as string)}
                onClick={handleLinkClick}
                className="group flex w-full items-center justify-start gap-2.5 px-1"
              >
                {link.icon && (
                  <div className={iconWrapClassName}>
                    {link.icon}
                  </div>
                )}
                <span className="truncate  text-[16px]">{link.text}</span>
              </Link>
            )
          })}
        </nav>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNavAside

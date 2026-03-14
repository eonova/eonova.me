'use client'

import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import { cn } from '~/utils'

function MobileNavAside() {
  const navStore = useNav()
  const pathname = usePathname()

  // 监听侧边栏状态，动态设置 body 的 overflow
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

  // 点击链接时关闭侧边栏
  const handleLinkClick = () => {
    navStore.setIsVisible()
  }

  // 判断是否为首页
  const isHome = pathname === '/'

  // 分离有子菜单和没有子菜单的链接
  const linksWithSubMenu = HEADER_LINKS.filter(link => link.subMenu && link.subMenu.length > 0)
  const linksWithoutSubMenu = HEADER_LINKS.filter(link => !link.subMenu || link.subMenu.length === 0)

  return (
    <Drawer open={navStore.isVisible} onOpenChange={handleLinkClick} direction="bottom">
      <DrawerContent className="max-h-[90vh] rounded-t-2xl border-t-2">
        <DrawerHeader className="sr-only">
          <DrawerTitle>导航菜单</DrawerTitle>
          <DrawerDescription>网站导航链接</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-5 pb-6 pt-4">
          {/* Home 链接 */}
          <div className="mb-6">
            <Link
              href="/"
              onClick={handleLinkClick}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200',
                {
                  'bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20': isHome,
                  'text-muted-foreground hover:bg-muted/60 hover:text-foreground': !isHome,
                },
              )}
            >
              <div
                className={cn(
                  'flex size-6 items-center justify-center rounded-lg transition-all duration-200',
                  {
                    'bg-primary text-primary-foreground shadow-sm': isHome,
                    'bg-muted/50 text-muted-foreground group-hover:bg-muted': !isHome,
                  },
                )}
              >
                <Home className={cn('size-4', { 'text-primary-foreground': isHome })} />
              </div>
              <span className="font-medium">Home</span>
              {isHome && (
                <div className="absolute right-4 size-2 rounded-full bg-primary" />
              )}
            </Link>
          </div>

          {/* 无子菜单的链接组 */}
          {linksWithoutSubMenu.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2.5">
                {linksWithoutSubMenu.map((link) => {
                  const isActive = link.href === pathname
                  return (
                    <Link
                      key={link.key}
                      href={link.href === '#' ? '#' : (link.href as any)}
                      onClick={handleLinkClick}
                      className={cn(
                        'group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        {
                          'bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20': isActive,
                          'text-muted-foreground hover:bg-muted/60 hover:text-foreground': !isActive,
                        },
                      )}
                    >
                      {link.icon && (
                        <div
                          className={cn(
                            'flex size-5 items-center justify-center transition-colors',
                            {
                              'text-primary': isActive,
                              'text-muted-foreground group-hover:text-foreground': !isActive,
                            },
                          )}
                        >
                          {link.icon}
                        </div>
                      )}
                      <span>{link.text}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* 有子菜单的链接组 */}
          {linksWithSubMenu.map((link) => {
            const isGroupActive = link.href === pathname || link.subMenu?.some(sub => sub.href === pathname)
            return (
              <div key={link.key} className="mb-6 last:mb-0">
                {/* 分组标题 */}
                <div className="mb-3 flex items-center gap-2.5 px-1">
                  {link.icon && (
                    <div
                      className={cn(
                        'flex size-5 items-center justify-center transition-colors',
                        {
                          'text-primary': isGroupActive,
                          'text-muted-foreground': !isGroupActive,
                        },
                      )}
                    >
                      {link.icon}
                    </div>
                  )}
                  <h3
                    className={cn(
                      'text-sm font-semibold transition-colors',
                      {
                        'text-foreground': isGroupActive,
                        'text-muted-foreground': !isGroupActive,
                      },
                    )}
                  >
                    {link.text}
                  </h3>
                </div>
                {/* 子菜单链接 - 两列布局 */}
                {link.subMenu && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {link.subMenu.map((subLink) => {
                      const isSubActive = subLink.href === pathname
                      return (
                        <Link
                          key={subLink.key}
                          href={subLink.href === '#' ? '#' : (subLink.href as any)}
                          onClick={handleLinkClick}
                          className={cn(
                            'group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                            {
                              'bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20': isSubActive,
                              'text-muted-foreground hover:bg-muted/60 hover:text-foreground': !isSubActive,
                            },
                          )}
                        >
                          {subLink.icon && (
                            <div
                              className={cn(
                                'flex size-4 items-center justify-center transition-colors',
                                {
                                  'text-primary': isSubActive,
                                  'text-muted-foreground group-hover:text-foreground': !isSubActive,
                                },
                              )}
                            >
                              {subLink.icon}
                            </div>
                          )}
                          <span>{subLink.text}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNavAside

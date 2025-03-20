'use client'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react' // 引入 useEffect
import { HEADER_LINKS } from '~/config/links'
import { useNav } from '~/stores/nav'
import { cn } from '~/utils'
import { Sheet, SheetContent, SheetTitle, VisuallyHidden } from '../base'
import { Separator } from '../base/separator'

function MobileNavAside() {
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

      <Sheet open={navStore.isVisible} onOpenChange={handleLinkClick}>
        <SheetContent side="left">
          <VisuallyHidden>
            <SheetTitle>侧边栏</SheetTitle>
          </VisuallyHidden>
          <button
            type="button"
            className="absolute top-8 right-8 z-50 rounded-md md:hidden"
            onClick={() => navStore.setIsVisible()}
            aria-label="Close menu"
          >
            <X className="text-3xl" />
          </button>
          <div className="h-full overflow-y-auto">
            <div className="py-8 pt-16 flex gap-6 items-center">
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
            <ul className="w-full my-5 flex flex-col gap-5 ">
              {HEADER_LINKS.map((link) => {
                const isActive = link.href === pathname

                return (
                  <li
                    key={link.key}
                    className="relative flex flex-col items-start justify-center gap-7"
                  >
                    <Link
                      className={cn(
                        'w-full bg-white/10 dark:bg-transparent font-medium transition-colors flex items-center text-[15px] gap-3',
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
                    {
                      link.subMenu && (
                        <ul className="grid grid-cols-2 gap-7 w-full rounded-md overflow-hidden">
                          {link.subMenu.map((subLink) => {
                            const isSubActive = subLink.href === pathname

                            return (
                              <li
                                key={subLink.key}
                                className="relative"
                              >
                                <Link
                                  className={cn(
                                    'w-full font-medium transition-colors flex items-center text-[15px] gap-7',
                                    {
                                      'text-muted-foreground hover:text-foreground': !isSubActive,
                                    },
                                    {
                                      'text-foreground': isSubActive,
                                    },
                                  )}
                                  href={subLink.href}
                                  onClick={handleLinkClick} // 点击链接时关闭侧边栏
                                >
                                  {/* {subLink.icon} */}
                                  {subLink.text}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )
                    }
                  </li>
                )
              })}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default MobileNavAside

'use client'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react' // 引入 useEffect
import { Sheet, SheetContent, SheetTitle, VisuallyHidden } from '~/components/base'
import { Separator } from '~/components/base/separator'
import { HEADER_LINKS } from '~/config/links'
import { useNav } from '~/stores/nav'
import { cn } from '~/utils'

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
            <div className="flex items-center gap-6 py-8 pt-16">
              <Image
                src="/images/home/avatar.webp"
                className="rounded-full"
                width={70}
                height={70}
                alt="Eonova"
              />
              <div className="flex flex-col gap-2">
                <h3 className="font-world text-3xl">Eonova</h3>
                <h4 className="text-gray-600/80 dark:text-white/50">一个爱捣鼓的前端</h4>
              </div>
            </div>
            <Separator className="mx-auto" />
            <ul className="my-5 flex w-full flex-col gap-5">
              {HEADER_LINKS.map((link) => {
                const isActive = link.href === pathname

                return (
                  <li
                    key={link.key}
                    className="relative flex flex-col items-start justify-center gap-7"
                  >
                    <Link
                      className={cn(
                        'flex w-full items-center gap-3 bg-white/10 text-[15px] font-medium transition-colors dark:bg-transparent',
                        {
                          'text-muted-foreground hover:text-foreground': !isActive,
                        },
                        {
                          'text-foreground': isActive,
                        },
                      )}
                      href={link.href as any}
                      onClick={handleLinkClick} // 点击链接时关闭侧边栏
                    >
                      {link.icon}
                      {link.text}
                    </Link>
                    {link.subMenu && (
                      <ul className="grid w-full grid-cols-2 gap-7 overflow-hidden rounded-md">
                        {link.subMenu.map((subLink) => {
                          const isSubActive = subLink.href === pathname

                          return (
                            <li key={subLink.key} className="relative">
                              <Link
                                className={cn(
                                  'flex w-full items-center gap-7 text-[15px] font-medium transition-colors',
                                  {
                                    'text-muted-foreground hover:text-foreground': !isSubActive,
                                  },
                                  {
                                    'text-foreground': isSubActive,
                                  },
                                )}
                                href={subLink.href as any}
                                onClick={handleLinkClick} // 点击链接时关闭侧边栏
                              >
                                {/* {subLink.icon} */}
                                {subLink.text}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
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

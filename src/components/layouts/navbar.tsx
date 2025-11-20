'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HEADER_LINKS } from '~/config/links'
import { cn } from '~/utils'

const MenuPopover = dynamic(() => import('./menu-popover'), {
  loading: () => null,
})

function Navbar() {
  const pathname = usePathname()
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // 防抖函数
  const debounce = useCallback((fn: () => void, delay: number) => {
    if (debounceTimer.current)
      clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(fn, delay)
  }, [])

  // 全局点击关闭逻辑
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeSubMenu) {
        const isInside
          = e.target
            && (e.target as HTMLElement).closest(`.menu-popover[data-key="${activeSubMenu}"]`)
        if (!isInside) {
          setActiveSubMenu(null)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [activeSubMenu])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimer.current)
        clearTimeout(debounceTimer.current)
      if (hoverTimeout)
        clearTimeout(hoverTimeout)
    }
  }, [hoverTimeout])

  return (
    <nav>
      <ul className="hidden gap-2.5 md:flex">
        {HEADER_LINKS.map((link) => {
          const isActive = link.href === pathname
          const hasSubMenu = !!link.subMenu

          return (
            <li
              key={link.key}
              className="nav-menu relative flex h-[60px] items-center justify-center"
              onMouseEnter={() => {
                if (hasSubMenu) {
                  // 添加防抖处理
                  debounce(() => {
                    if (hoverTimeout)
                      clearTimeout(hoverTimeout)
                    setActiveSubMenu(link.key)
                  }, 100) // 100ms防抖时间
                }
              }}
              onMouseLeave={() => {
                if (hasSubMenu) {
                  setHoverTimeout(
                    setTimeout(() => {
                      setActiveSubMenu(null)
                    }, 200), // 保持200ms延迟关闭
                  )
                }
              }}
            >
              <Link
                className={cn(
                  'group flex items-center rounded px-2 py-2 text-sm font-medium transition-colors',
                  {
                    'text-muted-foreground hover:text-foreground': !isActive,
                    'text-foreground': isActive,
                    'cursor-default': hasSubMenu && link.href === '#',
                  },
                )}
                href={hasSubMenu && link.href === '#' ? '#' : (link.href as any)}
              >
                {link.text}
              </Link>

              {isActive && (
                <>
                  <div className="bg-nav-link-indicator dark:bg-nav-link-indicator-dark absolute bottom-0 left-1/2 h-px w-12 -translate-x-1/2" />
                  <div className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-lg bg-[rgb(255_122_151)] blur dark:bg-[rgb(223_29_72)]" />
                </>
              )}

              {hasSubMenu && (
                <div
                  className={cn(
                    'absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 transform transition-all duration-200 ease-out',
                    activeSubMenu === link.key
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-2 opacity-0',
                  )}
                  data-key={link.key}
                  onMouseEnter={() => hoverTimeout && clearTimeout(hoverTimeout)}
                  onMouseLeave={() => setActiveSubMenu(null)}
                >
                  <MenuPopover isOpen={activeSubMenu === link.key} link={link} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar

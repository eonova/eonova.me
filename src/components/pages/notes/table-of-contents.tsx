'use client'

import type { TOC } from '@eonova/mdx-plugins'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useScrollspy } from '~/hooks/use-scrollspy'
import { cn } from '~/utils'

interface TableOfContentsProps {
  toc: TOC[]
}

function TableOfContents(props: TableOfContentsProps) {
  const { resolvedTheme: theme } = useTheme()
  const isDark = theme === 'dark'

  const { toc } = props
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeIdFromScrollspy = useScrollspy(
    toc.map(item => item.url),
    { rootMargin: '0% 0% -80% 0%' },
  )

  useEffect(() => {
    setActiveId(activeIdFromScrollspy ?? null)
  }, [activeIdFromScrollspy])

  const getActiveIds = (activeId: string) => {
    const activeItem = toc.find(item => item.url === activeId)
    if (!activeItem)
      return []

    const activeIds = [activeItem.url]
    let currentDepth = activeItem.depth

    for (let i = toc.indexOf(activeItem) - 1; i >= 0; i--) {
      const currentItem = toc[i]
      if (currentItem && currentItem.depth < currentDepth) {
        activeIds.unshift(currentItem.url)
        currentDepth = currentItem.depth
      }
    }

    return activeIds
  }

  const allActiveIds = (activeId && getActiveIds(activeId)) ?? []

  // 获取最小的depth
  const minDepth = toc.reduce((prev, curr) => {
    return Math.min(prev, curr.depth)
  }, Number.MAX_SAFE_INTEGER)

  // 获取最大的depth
  const maxDepth = toc.reduce((prev, curr) => {
    return Math.max(prev, curr.depth)
  }, Number.MIN_SAFE_INTEGER)

  // 获取目录是否被hover
  const [HoverUrl, setHoverUrl] = useState<string | null>(null)

  function handleMouseEnter(url: string) {
    setHoverUrl(url)
  }

  function handleMouseLeave() {
    setHoverUrl(null)
  }

  function getColor(isVisible: boolean, url: string) {
    // 根据层级不同颜色不同
    if (isDark) {
      if (isVisible || url === HoverUrl)
        return 'rgba(255, 255, 255, .5)'
      return 'rgba(255, 255, 255, .1)'
    }
    else {
      if (isVisible || url === HoverUrl)
        return 'rgba(0, 0, 0, .5)'
      return 'rgba(0, 0, 0,.1)'
    }
  }

  return (
    <div className="hidden lg:block lg:min-h-70 lg:min-w-[150px]">
      <div>
        {toc.map((item) => {
          const { title, url, depth } = item

          return (
            <Link
              key={url}
              href={`#${url}`}
              className={cn(
                'text-muted-foreground hover:text-foreground block py-2.5 pr-2.5 text-sm leading-[1.2] transition-colors',
                allActiveIds.includes(url) && 'text-foreground',
              )}
              style={{
                paddingLeft: 14,
              }}
              onMouseEnter={() => handleMouseEnter(url)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center">
                <div
                  style={{
                    width: 10 * maxDepth,
                  }}
                >
                  <span
                    className="rounded-full"
                    style={{
                      width: `${8 * (maxDepth - depth + 1)}px`,
                      background: getColor(allActiveIds.includes(url), url),
                      display: 'inline-block',
                      height: '5px',
                    }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: allActiveIds.includes(url) || HoverUrl ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn('truncate', depth === minDepth ? 'font-bold' : '')}
                >
                  {title}
                </motion.div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TableOfContents

'use client'

import type { TOC } from '@ileostar/mdx'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useState } from 'react'

import { useScrollspy } from '~/hooks/use-scrollspy'
import { cn } from '~/lib/utils'

interface TableOfContentsProps {
  toc: TOC[]
}

function TableOfContents(props: TableOfContentsProps) {
  const { theme } = useTheme()
  const { toc } = props
  const activeId = useScrollspy(
    toc.map(item => item.url),
    { rootMargin: '0% 0% -80% 0%' },
  )
  //
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

  const isDark = theme === 'dark'

  function getColor(depth: number, isVisible: boolean) {
    // 根据层级不同颜色不同
    if (isDark) {
      return isVisible ? 'rgba(255, 255, 255, .4)' : 'rgba(255, 255, 255, .1)'
    }
    else {
      return isVisible ? 'rgba(0, 0, 0,.4)' : 'rgba(0, 0, 0,.2)'
    }
  }

  // 获取目录是否被hover
  const [isHover, setHoverState] = useState<string | null>(null)

  function handleMouseEnter(url: string) {
    setHoverState(url)
  }

  function handleMouseLeave() {
    setHoverState(null)
  }

  return (
    <div className="hidden lg:block">
      <div className="mb-4 pl-4">目录</div>
      <div>
        {
          toc.map((item) => {
            const { title, url, depth } = item

            return (
              <Link
                key={url}
                href={`#${url}`}
                className={
                  cn(
                    'text-muted-foreground hover:text-foreground block py-2.5 pr-2.5 text-sm leading-[1.2] transition-colors',
                    allActiveIds.includes(url) && 'text-foreground',
                  )
                }
                style={{
                  paddingLeft: 14,
                }}
                onMouseEnter={() => handleMouseEnter(url)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center">
                  <div style={{
                    width: 10 * (maxDepth),
                  }}
                  >
                    <span
                      className="rounded-full"
                      style={{
                        width: `${8 * (maxDepth - depth + 1)}px`,
                        background: getColor(depth, allActiveIds.includes(url)),
                        display: 'inline-block',
                        height: '5px',
                      }}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: allActiveIds.includes(url) || isHover ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={depth === minDepth ? 'font-bold' : ''}
                  >
                    {title}
                  </motion.div>
                </div>
              </Link>
            )
          },
          )
        }
      </div>
    </div>
  )
}

export default TableOfContents

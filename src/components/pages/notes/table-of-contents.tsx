'use client'

import type { TOC } from '@eonova/mdx-plugins'
import { RotateCw } from 'lucide-react'
import { motion, useScroll, useSpring } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Separator } from '~/components/base/separator'
import { useScrollspy } from '~/hooks/use-scrollspy'
import { cn } from '~/utils'

interface TableOfContentsProps {
  toc: TOC[]
}

function TableOfContents(props: TableOfContentsProps) {
  const { toc } = props
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeIdFromScrollspy = useScrollspy(
    toc.map(item => item.url),
    { rootMargin: '0% 0% -80% 0%' },
  )

  useEffect(() => {
    setActiveId(activeIdFromScrollspy ?? null)
  }, [activeIdFromScrollspy])

  // 获取最小的depth
  const minDepth = toc.reduce((prev, curr) => {
    return Math.min(prev, curr.depth)
  }, Number.MAX_SAFE_INTEGER)

  // 滚动进度
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  // 使用 useSpring 让数字变化更平滑
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      setProgress(Math.round(latest * 100))
    })
  }, [smoothProgress])

  return (
    <div className="hidden lg:block lg:min-h-70 lg:min-w-[150px]">
      <div className="flex flex-col gap-1.5">
        {toc.map((item) => {
          const { title, url, depth } = item
          const isActive = activeId === url

          return (
            <Link
              key={url}
              href={`#${url}`}
              className="relative block"
            >
              <div className="relative flex items-center">
                {isActive && (
                  <motion.div
                    layoutId="toc-active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-rose-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <span
                  className={cn(
                    'block truncate text-sm transition-colors duration-200',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  style={{
                    paddingLeft: 16 + (depth - minDepth) * 12,
                  }}
                >
                  {title}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <Separator className="my-4" />

      <div className="flex items-center gap-2 text-sm text-muted-foreground pl-4">
        <RotateCw className="size-3.5" />
        <span className="tabular-nums">
          {progress}
          %
        </span>
      </div>
    </div>
  )
}

export default TableOfContents

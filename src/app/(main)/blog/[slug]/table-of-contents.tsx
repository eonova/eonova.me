'use client'

import type { TOC } from '@ileostar/mdx'
import Link from 'next/link'

import { useScrollspy } from '~/hooks/use-scrollspy'
import { cn } from '~/lib/utils'

interface TableOfContentsProps {
  toc: TOC[]
}

function TableOfContents(props: TableOfContentsProps) {
  const { toc } = props
  const activeId = useScrollspy(
    toc.map(item => item.url),
    { rootMargin: '0% 0% -80% 0%' },
  )

  return (
    <div className="hidden lg:block">
      <div className="mb-4 pl-4">目录</div>
      <div>
        {toc.map((item) => {
          const { title, url, depth } = item

          return (
            <Link
              key={url}
              href={`#${url}`}
              className={cn(
                'text-muted-foreground hover:text-foreground block py-2.5 pr-2.5 text-sm leading-[1.2] transition-colors',
                url === activeId && 'text-foreground',
              )}
              style={{
                paddingLeft: (depth - 1) * 16,
              }}
            >
              {title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TableOfContents

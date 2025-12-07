'use client'

import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useGenerateSummary } from '~/hooks/queries/ai.query'
import { cn } from '~/utils/cn'
import { extractPlainTextFromMarkdown } from '~/utils/remove-useless'

interface AISummaryProps {
  summary?: string
  content: string
  slug: string
  type?: 'post' | 'note'
  className?: string
  color?: 'blue' | 'orange'
}

export function AISummary({
  summary: initialSummary,
  content,
  slug,
  type = 'post',
  className,
  color = 'blue',
}: AISummaryProps) {
  const { data: aiSummary, isPending, mutate } = useGenerateSummary()
  const [displayedSummary, setDisplayedSummary] = useState('')

  useEffect(() => {
    if (content) {
      const handleContent = extractPlainTextFromMarkdown(content)
      mutate({ content: handleContent, slug, type })
    }
  }, [content, slug, type, mutate])

  let summary = initialSummary
  if (!summary && aiSummary) {
    summary = typeof aiSummary === 'string' ? aiSummary : (aiSummary?.summary ?? undefined)
  }

  useEffect(() => {
    if (!summary)
      return

    const cleanSummary = summary.trim()
    setDisplayedSummary('')
    let index = 0

    const timer = setInterval(() => {
      if (index < cleanSummary.length) {
        index++
        setDisplayedSummary(cleanSummary.slice(0, index))
      }
      else {
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [summary])

  const bgColor = color === 'orange' ? 'from-[#BC5449]/10 via-[#BC5449]/1' : 'from-[#4954BC]/10 via-[#4954BC]/1'
  const textColor = color === 'orange' ? 'text-[#BC5449]' : 'text-[#4954BC]'
  const spanColor = color === 'orange' ? 'bg-[#BC5449]/60' : 'bg-[#4954BC]/60'

  if (!summary && !isPending)
    return null

  return (
    <div
      className={cn('my-4 mb-10', className)}
      style={
        {
          '--accent': color === 'orange' ? '4 47% 51%' : '234 47% 51%',
        } as React.CSSProperties
      }
    >
      <div className="relative my-8 -mx-4 lg:-mx-8 overflow-hidden -mb-36">
        <div className={`relative -skew-x-2 transform bg-linear-[170deg] via-5§0% ${bgColor} to-transparent px-8 py-6 pb-32 transition-all duration-300`}>
          <div className="skew-x-2 transform">

            <div className="absolute right-8 top-3 flex items-center gap-2 text-xs text-base-content/40">
              <span className={`size-2 animate-pulse rounded-full ${spanColor}`}></span>
              <span className={`font-mono ${textColor} opacity-60`}>AI·GEN</span>
            </div>
            <div className="max-w-4xl pt-3">
              <h3 className={`mb-3 flex items-center gap-2 text-base font-medium leading-tight ${textColor}`}>
                <Sparkles className="size-4" />
                关键洞察
              </h3>
              <div className="overflow-hidden">
                <div className="space-y-2 text-sm leading-relaxed text-base-content/80">
                  {summary
                    ? (
                        <p className="whitespace-pre-wrap">{displayedSummary}</p>
                      )
                    : (
                        <div className="space-y-2 animate-pulse">
                          <div className="h-4 bg-gray-200/50 rounded w-3/4 dark:bg-neutral-800"></div>
                          <div className="h-4 bg-gray-200/50 rounded w-1/2 dark:bg-neutral-800"></div>
                        </div>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

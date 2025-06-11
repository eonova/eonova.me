'use client'

import type { FC } from 'react'

import { Bot } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { AutoResizeHeight } from '~/components/shared/auto-resize-height'
import { api } from '~/trpc/react'
import { cn } from '~/utils'
import { isNoteModel, isPageModel, isPostModel } from '~/utils/url-builder'

export interface AiSummaryProps {
  data: any
  className?: string
}

function SummaryContainer(props: {
  isLoading: boolean
  summary?: string
  className?: string
}) {
  const { className, isLoading, summary } = props
  return (
    <div
      data-hide-print
      className={cn(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        className,
      )}
    >
      <div className="flex items-center">
        <Bot className="mr-2" />
        AI 生成的摘要
      </div>

      <AutoResizeHeight duration={0.3}>
        <div className="!m-0 text-sm leading-loose text-base-content/85">
          {isLoading
            ? (
                <div className="space-y-2">
                  <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
                  <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
                  <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
                </div>
              )
            : (
                summary
              )}
        </div>
      </AutoResizeHeight>
    </div>
  )
}

export const AISummary: FC<AiSummaryProps> = (props) => {
  const { data } = props

  const payload = useMemo(() => {
    let payload: any

    if (isPostModel(data)) {
      payload = {
        category: data.category.slug,
        slug: data.slug,
        type: 'post',
      }
    }
    else if (isNoteModel(data)) {
      payload = {
        nid: data.nid,
        type: 'note',
      }
    }
    else if (isPageModel(data)) {
      payload = {
        slug: data.slug,
        type: 'page',
      }
    }
    else {
      throw new Error('未知类型')
    }

    return payload
  }, [data])

  const { mutate, isPending } = api.ai.generate.useMutation()

  useEffect(() => {
    if (payload) {
      mutate(payload)
    }
  }, [payload])

  return <SummaryContainer isLoading={isPending} summary={data?.summary} />
}

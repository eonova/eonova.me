'use client'

import type { FC } from 'react'

import { useMutation } from '@tanstack/react-query'
import { Bot } from 'lucide-react'
import { useEffect } from 'react'
import { AutoResizeHeight } from '~/components/shared/auto-resize-height'
import { useTRPC } from '~/trpc/client'
import { cn } from '~/utils'
import { extractPlainTextFromMarkdown } from '~/utils/removeuseless'

export interface AiSummaryProps {
  className?: string
  [key: string]: unknown
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

export const AISummary: FC<AiSummaryProps> = (props: any) => {
  const trpc = useTRPC()
  const { data: aiSummary, isPending, mutate } = useMutation(trpc.ai.generate.mutationOptions({
    onSuccess: (data) => {
      console.log('data', data)
    },
    onError: (error) => {
      console.log('error', error)
    },
  }))
  const content = props.data.content as string
  const slug = props.data.slug as string

  useEffect(() => {
    if (content) {
      const handleContent = extractPlainTextFromMarkdown(content)
      mutate({ content: handleContent, slug })
    }
  }, [props.content, props.slug, mutate])

  // 优先展示 props.summary，其次展示 aiSummary
  let summary: string | undefined = props.summary as string | undefined
  if (!summary && aiSummary) {
    summary = typeof aiSummary === 'string' ? aiSummary : aiSummary?.summary ?? undefined
  }

  return <SummaryContainer isLoading={isPending} summary={summary} className={props.className} />
}

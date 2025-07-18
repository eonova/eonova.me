'use client'

import NumberFlow, { continuous } from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { BlurImage } from '~/components/base/blur-image'
import { AISummary } from '~/components/modules/ai/summary'
import { usePostContext } from '~/contexts/post'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { useTRPC } from '~/trpc/client'

function Header() {
  const { cover, date, title, slug, ...postData } = usePostContext()
  const trpc = useTRPC()
  const formattedDate = useFormattedDate(date, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  const incrementMutation = useMutation(
    trpc.views.increment.mutationOptions({
      onSettled: () =>
        trpc.views.get.queryOptions({
          slug,
        }),
    }),
  )
  const viewsCountQuery = useQuery(
    trpc.views.get.queryOptions({
      slug,
    }),
  )

  const commentsCountQuery = useQuery(
    trpc.comments.getTotalCommentsCount.queryOptions({
      slug,
    }),
  )
  const incremented = useRef(false)

  useEffect(() => {
    if (!incremented.current) {
      incrementMutation.mutate({ slug })
      incremented.current = true
    }
  }, [incrementMutation, slug])
  return (
    <div className="space-y-12 py-12">
      <div className="space-y-12 sm:px-8">
        <h1 className="bg-gradient-to-b from-black via-black/90 to-black/70 to-[90%] bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl md:leading-[64px] dark:from-white dark:via-white/90 dark:to-white/70">
          {title}
        </h1>
        <div className="grid grid-cols-2 text-sm max-md:gap-4 md:grid-cols-4">
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">作者</div>
            <Link href="https://github.com/eonova" className="flex items-center gap-2">
              <BlurImage
                src="/images/home/avatar.webp"
                className="rounded-full"
                width={24}
                height={24}
                alt="Eonova"
              />
              Eonova
            </Link>
          </div>
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">发布</div>
            <div>{formattedDate}</div>
          </div>
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">浏览</div>
            {viewsCountQuery.status === 'pending' ? '--' : null}
            {viewsCountQuery.status === 'error' ? '错误' : null}
            {viewsCountQuery.status === 'success'
              ? (
                  <NumberFlow willChange plugins={[continuous]} value={viewsCountQuery.data.views} />
                )
              : null}
          </div>
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">评论数</div>
            {commentsCountQuery.status === 'pending' ? '--' : null}
            {commentsCountQuery.status === 'error' ? '错误' : null}
            {commentsCountQuery.status === 'success'
              ? (
                  <NumberFlow
                    willChange
                    plugins={[continuous]}
                    value={commentsCountQuery.data.comments}
                  />
                )
              : null}
          </div>
        </div>
      </div>
      <AISummary data={{ ...postData, title, slug }} className="mx-auto" />
    </div>
  )
}

export default Header

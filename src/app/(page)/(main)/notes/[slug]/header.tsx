'use client'

import NumberFlow from '@number-flow/react'
import { useEffect, useRef } from 'react'

import { useNoteContext } from '~/contexts/note'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { api } from '~/trpc/react'

function Header() {
  const { createTime, title, slug } = useNoteContext()
  const utils = api.useUtils()
  const formattedDate = useFormattedDate(createTime, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  // const images = cover !== '' ? cover : '/images/og-background.png'

  const incrementMutation = api.views.increment.useMutation({
    onSettled: () => utils.views.get.invalidate(),
  })
  const viewsCountQuery = api.views.get.useQuery({
    slug,
  })

  const commentsCountQuery = api.comments.getTotalCommentsCount.useQuery({
    slug,
  })
  const incremented = useRef(false)

  useEffect(() => {
    if (!incremented.current) {
      incrementMutation.mutate({ slug })
      incremented.current = true
    }
  }, [incrementMutation, slug])
  return (
    <div className=" flex flex-col gap-5 py-4">
      <h2 className="bg-gradient-to-b from-black via-black/90 to-black/70 to-90% bg-clip-text text-2xl font-bold text-transparent md:text-3xl dark:from-white dark:via-white/90 dark:to-white/70">
        {title}
      </h2>
      <div className="flex flex-start items-center gap-5 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">发布</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">浏览</span>
          {viewsCountQuery.status === 'pending' ? '--' : null}
          {viewsCountQuery.status === 'error' ? '错误' : null}
          {viewsCountQuery.status === 'success'
            ? (
                <NumberFlow willChange value={viewsCountQuery.data.views} />
              )
            : null}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">评论数</span>
          {commentsCountQuery.status === 'pending' ? '--' : null}
          {commentsCountQuery.status === 'error' ? '错误' : null}
          {commentsCountQuery.status === 'success'
            ? (
                <NumberFlow willChange value={commentsCountQuery.data.comments} />
              )
            : null}
        </div>
      </div>
    </div>
  )
}

export default Header

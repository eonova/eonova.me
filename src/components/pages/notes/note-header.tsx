'use client'

import NumberFlow, { continuous } from '@number-flow/react'
import { useEffect, useRef } from 'react'

import { useNoteContext } from '~/contexts/note'
import { useContentCommentCount } from '~/hooks/queries/comment.query'
import { useContentViewCount, useIncrementContentViewCount } from '~/hooks/queries/view.query'
import { useFormattedDate } from '~/hooks/use-formatted-date'

function Header() {
  const { date, title, slug } = useNoteContext()
  const formattedDate = useFormattedDate(date, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  const viewCountQuery = useContentViewCount({ slug, contentType: 'notes' })
  const commentCountQuery = useContentCommentCount({ slug, withReplies: true }, 'notes')

  const { mutate: incrementNoteView } = useIncrementContentViewCount({ slug, contentType: 'notes' })

  const incremented = useRef(false)

  useEffect(() => {
    if (!incremented.current) {
      incrementNoteView({ slug, contentType: 'notes' })
      incremented.current = true
    }
  }, [incrementNoteView, slug])

  return (
    <div className="flex flex-col gap-5 py-4">
      <h2 className="bg-gradient-to-b from-black via-black/90 to-black/70 to-[90%] bg-clip-text text-2xl font-bold text-transparent md:text-3xl dark:from-white dark:via-white/90 dark:to-white/70">
        {title}
      </h2>
      <div className="flex items-center justify-start gap-5 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">发布</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">浏览</span>
          {viewCountQuery.isLoading && '--'}
          {viewCountQuery.isError && '错误'}
          {viewCountQuery.isSuccess
            && <NumberFlow willChange plugins={[continuous]} value={viewCountQuery.data.views} />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">评论数</span>
          {commentCountQuery.isLoading && '--'}
          {commentCountQuery.isError && '错误'}
          {commentCountQuery.isSuccess && <NumberFlow willChange plugins={[continuous]} value={commentCountQuery.data.count} />}
        </div>
      </div>
    </div>
  )
}

export default Header

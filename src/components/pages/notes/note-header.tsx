'use client'

import NumberFlow, { continuous } from '@number-flow/react'
import { useEffect, useRef } from 'react'

import { useNoteContext } from '~/contexts/note'
import { useContentCommentCount } from '~/hooks/queries/comment.query'
import { useContentViewCount, useIncrementContentViewCount } from '~/hooks/queries/view.query'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { cn } from '~/utils/cn'

function Header({ className }: { className?: string }) {
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
    <div className={cn('flex flex-col gap-8', className)}>
      <h2 className=" bg-clip-text text-2xl font-bold font-mono md:text-4xl ">
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

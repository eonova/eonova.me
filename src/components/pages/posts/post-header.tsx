'use client'

import NumberFlow, { continuous } from '@number-flow/react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { BlurImage } from '~/components/base/blur-image'
import { AISummary } from '~/components/modules/ai/summary'
import { usePostContext } from '~/contexts/post'
import { useContentCommentCount } from '~/hooks/queries/comment.query'
import { useContentViewCount, useIncrementContentViewCount } from '~/hooks/queries/view.query'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import Intro from './post-intro'

interface HeaderProps {
  summary?: string
  intro?: string
}

function Header({ summary, intro }: HeaderProps) {
  const { cover, date, title, slug, ...postData } = usePostContext()
  const formattedDate = useFormattedDate(date, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  const viewCountQuery = useContentViewCount({ slug, contentType: 'posts' })
  const commentCountQuery = useContentCommentCount({ slug, withReplies: true }, 'posts')

  const { mutate: incrementPostView } = useIncrementContentViewCount({ slug, contentType: 'posts' })

  const incremented = useRef(false)

  useEffect(() => {
    if (!incremented.current) {
      incrementPostView({ slug, contentType: 'posts' })
      incremented.current = true
    }
  }, [incrementPostView, slug])

  return (
    <div className="space-y-12 pt-12">
      <div className="space-y-12 sm:px-8">
        <h1 className="bg-linear-to-b from-black via-black/90 to-black/70 to-[90%] bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl md:leading-16 dark:from-white dark:via-white/90 dark:to-white/70">
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
            {viewCountQuery.isLoading && '--'}
            {viewCountQuery.isError && '错误'}
            {viewCountQuery.isSuccess && <NumberFlow willChange plugins={[continuous]} value={viewCountQuery.data.views} />}
          </div>
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">评论数</div>
            {commentCountQuery.isLoading && '--'}
            {commentCountQuery.isError && '错误'}
            {commentCountQuery.isSuccess && (
              <NumberFlow
                willChange
                plugins={[continuous]}
                value={commentCountQuery.data.count}
              />
            )}
          </div>
        </div>
      </div>
      <AISummary
        content={postData.content}
        slug={slug}
        type="post"
        summary={summary}
        className="mx-auto"
      />
      <Intro intro={intro ?? ''} />
    </div>
  )
}

export default Header

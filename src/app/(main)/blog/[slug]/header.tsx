'use client'

import NumberFlow from '@number-flow/react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { BlurImage } from '~/components/base/blur-image'
import ImageZoom from '~/components/image-zoom'
import { usePostContext } from '~/contexts/post'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { api } from '~/trpc/react'

function Header() {
  const { cover, date, title, slug } = usePostContext()
  const utils = api.useUtils()
  const formattedDate = useFormattedDate(date, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  const images = cover !== '' ? cover : '/images/og-background.png'

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
    <div className="space-y-16 py-16">
      <div className="space-y-16 sm:px-8">
        <h1 className="bg-gradient-to-b from-black via-black/90 to-black/70 to-90% bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl md:leading-[64px] dark:from-white dark:via-white/90 dark:to-white/70">
          {title}
        </h1>
        <div className="grid grid-cols-2 text-sm max-md:gap-4 md:grid-cols-4">
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">作者</div>
            <Link href="https://github.com/ileostar" className="flex items-center gap-2">
              <BlurImage
                src="/images/avatar.png"
                className="rounded-full"
                width={24}
                height={24}
                alt="LeoStar"
              />
              LeoStar
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
                  <NumberFlow willChange value={viewsCountQuery.data.views} />
                )
              : null}
          </div>
          <div className="space-y-1 md:mx-auto">
            <div className="text-muted-foreground">评论数</div>
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
      <ImageZoom
        zoomImg={{
          src: images,
          alt: title,
        }}
      >
        <BlurImage
          src={images}
          className="rounded-lg"
          width={1200}
          height={630}
          lazy={false}
          alt={title}
        />
      </ImageZoom>
    </div>
  )
}

export default Header

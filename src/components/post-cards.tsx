'use client'

import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'

import Link from 'next/link'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { BlurImage } from './base/blur-image'

interface PostCardsProps {
  posts: CoreContent<Blog>[]
}

type PostCardProps = CoreContent<Blog>

function PostCards(props: PostCardsProps) {
  const { posts } = props

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {posts.map(post => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}

function PostCard(props: PostCardProps) {
  const { images, slug, title, summary, date } = props
  const formattedDate = useFormattedDate(date, {
    format: 'LL',
    loading: '--',
  })

  return (
    <Link
      href={`/blog/${slug}`}
      className="shadow-feature-card dark:shadow-feature-card-dark group rounded-xl px-2 py-4"
    >
      <BlurImage
        src={images}
        className="rounded-lg"
        width={1200}
        height={630}
        imageClassName="transition-transform group-hover:scale-105"
        alt={title}
      />
      <div className="flex items-center justify-between gap-2 px-2 pt-4 text-sm text-zinc-500">
        {formattedDate}
      </div>
      <div className="flex flex-col px-2 py-4">
        <h3 className="font-title text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground mt-2">{summary}</p>
      </div>
    </Link>
  )
}

export default PostCards

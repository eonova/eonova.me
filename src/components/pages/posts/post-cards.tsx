'use client'

import { ChartColumnStacked, Clock, Eye, TagIcon, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES } from '~/config/posts'
import { useContentLikeCount } from '~/hooks/queries/like.query'
import { useContentViewCount } from '~/hooks/queries/view.query'
import { formatDate } from '~/utils'
import { BottomToUpTransitionView } from '../../modules/transition'

interface PostData {
  slug: string
  title: string
  date: string | null
  categories: readonly string[]
  tags: readonly string[]
}

interface PostCardsProps {
  posts: PostData[]
}

type PostCardProps = PostData

function PostCards(props: PostCardsProps) {
  const { posts } = props
  return (
    <ul className="flex flex-col gap-5">
      {posts.map((post, idx) => (
        <PostCard key={post.slug} {...post} idx={idx} />
      ))}
    </ul>
  )
}

function PostCard(props: PostCardProps & { idx: number }) {
  const { slug, title, categories, date, idx } = props
  const viewsQuery = useContentViewCount({ slug, contentType: 'posts' })
  const likesQuery = useContentLikeCount({ slug, contentType: 'posts' })

  return (
    <BottomToUpTransitionView delay={700 + 50 * idx}>
      <Link
        href={`/posts/${slug}`}
        className="group relative flex w-full flex-col items-start gap-3 rounded-xl p-5 tracking-wide duration-500 hover:bg-slate-300/30 focus-visible:!shadow-none dark:hover:bg-slate-300/10"
      >
        <h2 className="font-dingtalk w-full text-3xl">{title}</h2>
        <ul className="flex items-center gap-2.5">
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <Clock className="size-3" />
            <span className="text-sm">{formatDate(date ? new Date(date) : new Date())}</span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <ChartColumnStacked className="size-3" />
            <span className="text-sm">{CATEGORIES.find(i => i.label === categories[0])?.name}</span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <TagIcon className="size-3" />
            <span className="text-sm">{props.tags?.join('、') || '无'}</span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <Eye className="size-3" />
            <span className="text-sm">
              {viewsQuery.status === 'pending' && '--'}
              {viewsQuery.status === 'error' && '错误'}
              {viewsQuery.status === 'success' && viewsQuery.data.views}
            </span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <ThumbsUp className="size-3" />
            <span className="text-sm">
              {likesQuery.status === 'pending' && '--'}
              {likesQuery.status === 'error' && '错误'}
              {likesQuery.status === 'success' && likesQuery.data.likes}
            </span>
          </li>
        </ul>
      </Link>
    </BottomToUpTransitionView>
  )
}

export default PostCards

'use client'

import type { BlogPost } from 'mdx/generated'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRightIcon, PencilIcon } from 'lucide-react'
import { allBlogPosts } from 'mdx/generated'
import Link from 'next/link'

import { useRef } from 'react'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { cn } from '~/lib/utils'
import { BlurImage } from '../base/blur-image'
import { buttonVariants } from '../base/button'
import { api } from '~/trpc/react'

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

function LatestArticles() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const filteredPosts = allBlogPosts
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 2)

  return (
    <motion.div
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{
        duration: 0.5,
      }}
      className="my-24"
    >
      <motion.h2
        className="text-center text-3xl font-semibold"
        initial={{
          y: 30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        最新文章
      </motion.h2>
      <motion.div
        className="mt-12 grid gap-4 md:grid-cols-2"
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {filteredPosts.map(post => (
          <Card key={post.slug} post={post} />
        ))}
      </motion.div>
      <div className="my-8 flex items-center justify-center">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({
              variant: 'outline',
            }),
            'rounded-xl',
          )}
        >
          查看所有文章
        </Link>
      </div>
    </motion.div>
  )
}

interface CardProps {
  post: BlogPost
}

function Card(props: CardProps) {
  const { post } = props
  const { cover, slug, title, summary, date } = post
  const formattedDate = useFormattedDate(date, {
    format: 'MMMM DD, YYYY',
    loading: '--',
  })
  const viewsQuery = api.views.get.useQuery({
    slug
  })

  const likesQuery = api.likes.get.useQuery({
    slug
  })

  return (
    <Link
      href={`/blog/${slug}`}
      className="shadow-feature-card dark:shadow-feature-card-dark group relative rounded-xl p-2"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <PencilIcon className="size-[18px]" />
          <h2>文章</h2>
        </div>
        <ArrowUpRightIcon className="size-[18px] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <BlurImage
        width={1200}
        height={630}
        src={cover ?? '/images/non-image.png'}
        alt={title}
        className="rounded-lg"
      />
      <div className="flex items-center justify-between gap-2 px-2 pt-4 text-sm text-zinc-500">
        {formattedDate}
        <div className='flex gap-2'>
          {likesQuery.status === 'pending' ? '--' : null}
          {likesQuery.status === 'error' ? '错误' : null}
          {likesQuery.status === 'success' ? (
            <div>{`${likesQuery.data.likes} 点赞`}</div>
          ) : null}
          <div>&middot;</div>
          {viewsQuery.status === 'pending' ? '--' : null}
          {viewsQuery.status === 'error' ? '错误' : null}
          {viewsQuery.status === 'success' ? (
            <div>{`${viewsQuery.data.views} 浏览量`}</div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col px-2 py-4 transition-transform ease-out group-hover:translate-x-0.5">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2">{summary}</p>
      </div>
    </Link>
  )
}

export default LatestArticles

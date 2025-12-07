import type { Metadata } from 'next'
import { allPosts } from 'content-collections'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BottomToUpTransitionView } from '~/components/modules/transition/bottom-to-top'
import PageTitle from '~/components/shared/page-title'
import TimelineList from '~/components/shared/timeline-list'
import { createMetadata } from '~/lib/metadata'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  return createMetadata({
    title: `Tag: ${decodedSlug}`,
    description: `Content tagged with ${decodedSlug}`,
    pathname: `/tags/${slug}`,
  })
}

export async function generateStaticParams() {
  const tags = new Set<string>()

  allPosts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })

  return Array.from(tags).map(tag => ({ slug: tag }))
}

export default async function TagPage(props: Props) {
  const { slug } = await props.params
  const decodedSlug = decodeURIComponent(slug)

  const posts = allPosts
    .filter(post => post.tags?.includes(decodedSlug))
    .map(post => ({ ...post, type: 'post' as const }))

  const items = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  if (items.length === 0) {
    notFound()
  }

  return (
    <div className="container max-w-5xl py-10">
      <PageTitle title={`#${decodedSlug}`} description={`内容标签为 "${decodedSlug}"`} />

      <main className="mt-10 text-zinc-950/80 md:px-3 dark:text-zinc-50/80">
        <TimelineList>
          {items.map((item, i) => {
            const date = new Date(item.date)
            const href = item.type === 'post' ? `/posts/${item.slug}` : `/notes/${item.slug}`

            return (
              <BottomToUpTransitionView
                key={`${item.type}-${item.slug}`}
                delay={100 + 50 * i}
                as="li"
                className="group flex min-w-0 items-center justify-between leading-loose"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Link href={href} className="min-w-0 truncate decoration-zinc-500/50 underline-offset-4 group-hover:underline">
                    {item.title}
                  </Link>
                </div>
                <span className="meta ml-4 shrink-0 text-sm text-muted-foreground">
                  {date.getFullYear()}
                  -
                  {String(date.getMonth() + 1).padStart(2, '0')}
                  -
                  {String(date.getDate()).padStart(2, '0')}
                </span>
              </BottomToUpTransitionView>
            )
          })}
        </TimelineList>
      </main>
    </div>
  )
}

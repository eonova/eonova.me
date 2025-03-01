import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NoneContent from '~/components/none-content'
import PageTitle from '~/components/page-title'
import TimelineList from '~/components/timeline-list'
import { BottomToUpTransitionView } from '~/components/transition'
import { SITE_URL } from '~/config/constants'
import { CATEGORIES } from '~/config/posts'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(props: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await props.params
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}

  const post = allPosts.find(p => p.slug === slug)

  if (!post)
    return {}

  const { date, modifiedTime, title, summary } = post

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(modifiedTime).toISOString()
  const url = `/categories/${slug}`

  return {
    title,
    description: summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      type: 'article',
      title,
      description: summary,
      publishedTime: ISOPublishedTime,
      modifiedTime: ISOModifiedTime,
      authors: SITE_URL,
      images: [
        {
          url: `/og/${slug}`,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      ...previousTwitter,
      title,
      description: summary,
      images: [
        {
          url: `/og/${slug}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  }
}

async function Page(props: PageProps) {
  const { slug } = await props.params

  const posts = allPosts.filter(p => p.categories.includes(slug)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const url = `${SITE_URL}/categories/${slug}`

  if (!posts) {
    notFound()
  }

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'headline': slug,
    'name': slug,
    'description': `分类-${CATEGORIES.find(i => i.label === slug)?.name}`,
    url,
    'image': `${SITE_URL}/og/${slug}`,
  }

  const title = `分类 - ${CATEGORIES.find(i => i.label === slug)?.name}`
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description="" />
      {
        posts.length > 0
          ? (
              <main className="mt-10 md:px-10 text-zinc-950/80 dark:text-zinc-50/80">
                <TimelineList>
                  {posts.map((child, i) => {
                    const date = new Date(child.date)

                    return (
                      <BottomToUpTransitionView
                        key={child.slug}
                        delay={700 + 50 * i}
                        as="li"
                        className="flex min-w-0 items-center justify-between leading-loose"
                      >
                        <Link
                          href={`/posts/${child.slug}`}
                          className="min-w-0 truncate"
                        >
                          {child.title}
                        </Link>
                        <span className="meta ml-2">
                          {(date.getMonth() + 1).toString().padStart(2, '0')}
                          /
                          {date.getDate().toString().padStart(2, '0')}
                          /
                          {date.getFullYear()}
                        </span>
                      </BottomToUpTransitionView>
                    )
                  })}
                </TimelineList>
              </main>
            )
          : (
              <div className="flex items-center justify-center h-[55vh]">
                <NoneContent className="mx-auto w-md h-md md:w-[90%] md:h-[70vh]" />
              </div>
            )
      }
    </>
  )
}

export default Page

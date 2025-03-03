import type { Note, Post } from 'content-collections'
import type { Metadata, ResolvingMetadata } from 'next'

import type { WebPage, WithContext } from 'schema-dts'
import { allNotes, allPosts } from 'content-collections'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NoneContent from '~/components/none-content'
import PageTitle from '~/components/page-title'
import TimelineList from '~/components/timeline-list'
import { BottomToUpTransitionView } from '~/components/transition'
import { SITE_DESCRIPTION, SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_NAME, SITE_URL, SITE_X_URL, SITE_YOUTUBE_URL } from '~/config/constants'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
const title = '归档'
const description = '回望过往，方知自己的成长。'
const url = `${SITE_URL}/archive`

export async function generateMetadata(_: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      type: 'profile',
      title,
      description,
    },
    twitter: {
      ...previousTwitter,
      title,
      description,
    },
  }
}

async function Page() {
  const articles = allPosts.concat(allNotes).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // 做成对象数组：键为年份，值为文章数组
  const articlesByYear = articles.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(article)
    return acc
  }, {} as Record<string, typeof articles>)

  if (!articles) {
    notFound()
  }

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    description,
    url,
    'mainEntity': {
      '@type': 'Person',
      'name': SITE_NAME,
      'description': SITE_DESCRIPTION,
      url,
      'sameAs': [SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={description} />
      {
        (articlesByYear && Object.keys(articlesByYear).length > 0)
          ? (
              <main className="mt-10 md:px-3 text-zinc-950/80 dark:text-zinc-50/80">
                {
                  Object.entries(articlesByYear).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, articles]) => {
                    return (
                      <ul key={year} className="mb-10">
                        <BottomToUpTransitionView
                          as="h4"
                          delay={700}
                          className="relative mb-4 ml-3 text-lg font-medium rounded-md before:content-auto before:absolute before:inset-y-[4px] before:-left-3 before:w-[2px] before:bg-accent"
                        >
                          {year}
                        </BottomToUpTransitionView>
                        <TimelineList>
                          {(articles as (Post | Note)[]).map((child: Post | Note, i: number) => {
                            return (
                              <BottomToUpTransitionView
                                key={child.slug}
                                delay={700 + 50 * i}
                                as="li"
                                className="flex min-w-0 items-center justify-between leading-loose"
                              >
                                <Link
                                  href={`/${child.type}/${child.slug}`}
                                  className="min-w-0 truncate"
                                >
                                  {child.title}
                                </Link>
                                <span className="meta ml-2">
                                  {child.type === 'posts' ? `${child.categoriesText}/文章` : `天气：${child.weather}/心情：${child.mood}/手记`}
                                </span>
                              </BottomToUpTransitionView>
                            )
                          })}
                        </TimelineList>
                      </ul>
                    )
                  })
                }
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

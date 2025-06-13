import type { Note, Post } from 'content-collections'

import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import { allNotes, allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import ArchiveContent from '~/components/pages/archive/content'
import PageTitle from '~/components/shared/page-title'
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

export async function generateMetadata(_: Readonly<PageProps>, parent: ResolvingMetadata): Promise<Metadata> {
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
  const articles = [...allPosts, ...allNotes].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // 做成对象数组：键为年份，值为文章数组
  const articlesByYear = articles.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear()
    acc[year] ??= []
    acc[year].push(article)
    return acc
  }, {} as Record<string, (Post | Note)[]>)

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
      <ArchiveContent articlesByYear={articlesByYear} />
    </>
  )
}

export default Page

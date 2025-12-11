import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import type { Note, Post } from '~/lib/content'
import { notFound } from 'next/navigation'
import ArchiveContent from '~/components/pages/archive/content'
import PageTitle from '~/components/shared/page-title'
import {
  SITE_DESCRIPTION,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'
import { getAllNotes, getAllPosts } from '~/lib/content'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

const title = '归档'
const description = '回望过往，方知自己的成长。'
const url = `${SITE_URL}/archive`

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/archive',
    title,
    description,
    openGraph: {
      type: 'profile',
    },
  })
}

async function Page() {
  const posts = await getAllPosts()
  const notes = await getAllNotes()
  const articles = [...posts, ...notes].sort((a, b) => {
    return new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime()
  })

  // 做成对象数组：键为年份，值为文章数组
  const articlesByYear = articles.reduce(
    (acc, article) => {
      const year = new Date(article.date ?? '').getFullYear()
      acc[year] ??= []
      acc[year].push(article as unknown as Post | Note)
      return acc
    },
    {} as Record<string, (Post | Note)[]>,
  )

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
      'url': getBaseUrl(),
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

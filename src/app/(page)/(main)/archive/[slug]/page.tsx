import type { Note, Post } from 'content-collections'

import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import { allNotes, allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import ArchiveContent from '~/components/pages/archive/content'
import PageTitle from '~/components/shared/page-title'
import { SITE_URL } from '~/config/constants'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
  pageProps: Readonly<PageProps>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await pageProps.params
  const title = `归档-${slug === 'posts' ? '文章' : '手记'}`
  const url = `${SITE_URL}/archive/${slug}`
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}
  return {
    title,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      type: 'profile',
      title,
    },
    twitter: {
      ...previousTwitter,
      title,
    },
  }
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return [{ slug: 'posts' }, { slug: 'notes' }]
}

async function Page(props: Readonly<PageProps>) {
  const { slug } = await props.params

  const articles = slug === 'posts' ? allPosts : allNotes
  // 做成对象数组：键为年份，值为文章数组
  const articlesByYear = articles.reduce(
    (acc, article) => {
      const year = new Date(article.date).getFullYear()
      acc[year] ??= []
      acc[year].push(article)
      return acc
    },
    {} as Record<string, (Post | Note)[]>,
  )
  const url = `${SITE_URL}/archive/${slug}`

  if (!articles) {
    notFound()
  }

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'headline': slug,
    'name': slug,
    'description': `归档-${slug === 'posts' ? '文章' : '手记'}`,
    url,
    'image': `${SITE_URL}/og/${slug}`,
  }

  const title = `归档-${slug === 'posts' ? '文章' : '手记'}`
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description="" />
      <ArchiveContent articlesByYear={articlesByYear} />
    </>
  )
}

export default Page

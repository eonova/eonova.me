import type { Note, Post } from 'content-collections'

import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import { allNotes, allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import ArchiveContent from '~/components/pages/archive/content'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { createMetadata } from '~/config/metadata'
import { getBaseUrl } from '~/utils'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
  pageProps: Readonly<PageProps>,
): Promise<Metadata> {
  const { slug } = await pageProps.params
  const title = `归档-${slug === 'posts' ? '文章' : '手记'}`
  return createMetadata({
    pathname: `/archive/${slug}`,
    title,
    description: `归档-${slug === 'posts' ? '文章' : '手记'}`,
  })
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
  const url = `${getBaseUrl()}/archive/${slug}`

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
    'image': `${getBaseUrl()}/og/${slug}`,
  }

  const title = `归档-${slug === 'posts' ? '文章' : '手记'}`

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description="" />
      <ArchiveContent articlesByYear={articlesByYear} />
    </>
  )
}

export default Page

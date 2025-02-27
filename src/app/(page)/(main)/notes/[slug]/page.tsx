import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allNotes } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Comments from '~/components/comments'
import TableOfContents from '~/components/layouts/table-of-contents'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { flags } from '~/lib/env'
import Header from './header'
import MobileTableOfContents from './mobile-table-of-contents'
import Providers from './providers'
import Mdx from '~/components/mdx'

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

  const note = allNotes.find(p => p.slug === slug)

  console.log('note', note)

  if (!note)
    return {}

  const { createTime, title, summary } = note

  const ISOPublishedTime = new Date(createTime).toISOString()
  const ISOModifiedTime = new Date(createTime).toISOString()
  const url = `/notes/${slug}`

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

  const note = allNotes.find(p => p.slug === slug)
  const url = `${SITE_URL}/blog/${slug}`

  if (!note) {
    notFound()
  }

  const { title, summary, createTime, code, toc } = note

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'name': title,
    'description': summary,
    url,
    'datePublished': createTime,
    'dateModified': createTime,
    'image': `${SITE_URL}/og/${slug}`,
    'author': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
    'publisher': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Providers note={note}>
        <div className='my-16 mb-8 p-10 w-full overflow-visible flex flex-col justify-between gap-2 relative bg-white dark:bg-zinc-900/50 md:col-start-1 rounded-[0_6px_6px_0] border-zinc-200/70 dark:border-neutral-800 lg:border'>
          <Header />
          <article className="">
            <Mdx code={code} />
          </article>
          {toc.length > 0 && <MobileTableOfContents toc={toc} />}
        </div>
      </Providers>

      {
        flags.comment && (
          <Suspense>
            <Comments slug={slug} />
          </Suspense>
        )
      }
    </>
  )
}

export default Page

import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allNotes } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Comments from '~/components/modules/comments'
import NoteMdx from '~/components/modules/mdx/note-mdx'
import TableOfContents from '~/components/pages/notes/table-of-contents'
import MobileTableOfContents from '~/components/shared/mobile-table-of-contents'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { flags } from '~/lib/env'
import Footer from './footer'
import Header from './header'
import Providers from './providers'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(props: Readonly<PageProps>, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await props.params
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}

  const note = allNotes.find(p => p.slug === slug)

  if (!note)
    return {}

  const { date, title, summary } = note

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(date).toISOString()
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

async function Page(props: Readonly<PageProps>) {
  const { slug } = await props.params

  const note = allNotes.find(p => p.slug === slug)
  const url = `${SITE_URL}/blog/${slug}`

  if (!note) {
    notFound()
  }

  const { title, summary, date, code, toc } = note

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'name': title,
    'description': summary,
    url,
    'datePublished': date,
    'dateModified': date,
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
        <div className="my-16 mb-8 p-10 w-full overflow-visible flex flex-col justify-between relative lg:flex-row gap-2 bg-white dark:bg-zinc-900/50 md:col-start-1 rounded-[0_6px_6px_0] border-zinc-200/70 border-solid dark:border-neutral-800 lg:border">
          <article className="w-full sm:px-4">
            <Header />
            <NoteMdx code={code} />
          </article>
          <aside className="w-[0] lg:ml-[-15vw] xl:ml-[-20vw] hidden lg:block">
            <div className="sticky ml-15 top-60 lg:min-w-[200px] lg:max-w-[200px]">
              {toc.length > 0 && <TableOfContents toc={toc} />}
            </div>
          </aside>
        </div>
        {toc.length > 0 && <MobileTableOfContents toc={toc} />}
        <Footer />
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

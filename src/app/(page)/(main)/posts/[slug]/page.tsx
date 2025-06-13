import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import TableOfContents from '~/components/layouts/table-of-contents'
import Comments from '~/components/modules/comments'
import Mdx from '~/components/modules/mdx'
import MobileTableOfContents from '~/components/shared/mobile-table-of-contents'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { flags } from '~/lib/env'
import Footer from './footer'
import Header from './header'
import LikeButton from './like-button'
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

  const post = allPosts.find(p => p.slug === slug)

  if (!post)
    return {}

  const { date, modifiedTime, title, summary } = post

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(modifiedTime).toISOString()
  const url = `/posts/${slug}`

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

  const post = allPosts.find(p => p.slug === slug)
  const url = `${SITE_URL}/blog/${slug}`

  if (!post) {
    notFound()
  }

  const { title, summary, date, modifiedTime, code, toc } = post

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'name': title,
    'description': summary,
    url,
    'datePublished': date,
    'dateModified': modifiedTime,
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
      <Providers post={post}>
        <Header />
        <div className="mt-8 w-full overflow-visible flex flex-col justify-between lg:flex-row gap-2">
          <article className="w-full sm:px-4">
            <Mdx code={code} />
          </article>
          <aside className="w-[0] lg:ml-[-15vw] xl:ml-[-20vw] hidden lg:block">
            <div className="sticky ml-5 top-32 lg:min-w-[200px] lg:max-w-[200px]">
              {toc.length > 0 && <TableOfContents toc={toc} />}
              {flags.likeButton && <LikeButton className="ml-5 justify-start" slug={slug} />}
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

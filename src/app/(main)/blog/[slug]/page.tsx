import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allBlogPosts } from 'mdx/generated'
import { notFound } from 'next/navigation'

import Mdx from '~/components/mdx'

import { SITE_NAME, SITE_URL } from '~/config/constants'
import Footer from './footer'
import Header from './header'
import MobileTableOfContents from './mobile-table-of-contents'
import ProgressBar from './progress-bar'
import Providers from './providers'
import TableOfContents from './table-of-contents'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export function generateStaticParams(): Array<{ slug: string, locale: string }> {
  return allBlogPosts.map(post => ({
    slug: post.slug,
    locale: post.language,
  }))
}

export async function generateMetadata(props: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug, locale } = await props.params

  const post = allBlogPosts.find(p => p.slug === slug && p.language === locale)

  if (!post)
    return {}

  const { date, modifiedTime, title, summary } = post

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(modifiedTime).toISOString()
  const previousTwitter = (await parent).twitter ?? {}
  const previousOpenGraph = (await parent).openGraph ?? {}
  const url = `/blog/${slug}`

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

  const post = allBlogPosts.find(p => p.slug === slug)
  const localizedPath = `/blog/${slug}`
  const url = `${SITE_URL}${localizedPath}`

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

        <div className="mt-8 flex flex-col justify-between lg:flex-row">
          <article className="w-full lg:w-[670px]">
            <Mdx code={code} />
          </article>
          <aside className="lg:min-w-[270px] lg:max-w-[270px]">
            <div className="sticky top-24">
              {toc.length > 0 ? <TableOfContents toc={toc} /> : null}
            </div>
          </aside>
        </div>
        <ProgressBar />

        {toc.length > 0 ? <MobileTableOfContents toc={toc} /> : null}
        <Footer />
      </Providers>

      {/* <Suspense>
        <Comments slug={slug} />
      </Suspense> */}
    </>
  )
}

export default Page

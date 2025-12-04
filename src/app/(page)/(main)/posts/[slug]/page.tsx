import type { Metadata } from 'next'

import type { BlogPosting, WithContext } from 'schema-dts'
import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '~/components/base/skeleton'
import CommentSection from '~/components/modules/comment-section/comment-section'
import Mdx from '~/components/modules/mdx'
import LikeButton from '~/components/pages/posts/like-button'
import Footer from '~/components/pages/posts/post-footer'
import Header from '~/components/pages/posts/post-header'
import Providers from '~/components/pages/posts/providers'
import TableOfContents from '~/components/pages/posts/table-of-contents'
import JsonLd from '~/components/shared/json-ld'
import MobileTableOfContents from '~/components/shared/mobile-table-of-contents'
import { MY_NAME, SITE_URL } from '~/config/constants'
import { createMetadata } from '~/config/metadata'
import { getPostBySlug } from '~/lib/content'
import { getBaseUrl } from '~/utils/get-base-url'

export async function generateMetadata(props: PageProps<'/posts/[slug]'>): Promise<Metadata> {
  const { params } = props
  const { slug } = await params

  const post = getPostBySlug(slug)

  if (!post)
    return {}

  return createMetadata({
    pathname: `/posts/${slug}`,
    title: post.title,
    description: post.summary,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedTime,
    },
  })
}
export const dynamic = 'force-static'

export function generateStaticParams() {
  return allPosts.map(p => ({ slug: p.slug }))
}

async function Page(props: PageProps<'/posts/[slug]'>) {
  const { slug } = await props.params

  const post = allPosts.find(p => p.slug === slug)
  const url = `${SITE_URL}/posts/${slug}`

  if (!post) {
    notFound()
  }

  const { title, summary, date, modifiedTime, code, toc } = post

  const baseUrl = getBaseUrl()
  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': summary,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url,
    },
    'image': `/og/posts/${post.slug}/image.webp`,
    'datePublished': date,
    'dateModified': modifiedTime,
    'author': {
      '@type': 'Person',
      'name': MY_NAME,
      'url': baseUrl,
    },
    'publisher': {
      '@type': 'Person',
      'name': MY_NAME,
      'url': baseUrl,
    },
  }
  return (
    <>
      <JsonLd json={jsonLd} />
      <Providers post={post}>
        <Header />
        <div className="mt-8 flex w-full flex-col justify-between gap-2 overflow-visible lg:flex-row">
          <article className="w-full sm:px-4">
            <Mdx code={code} />
          </article>
          <aside className="hidden w-0 lg:ml-[-15vw] lg:block xl:ml-[-20vw]">
            <div className="sticky top-32 ml-5 lg:max-w-[200px] lg:min-w-[200px]">
              {toc.length > 0 && <TableOfContents toc={toc} />}
              <LikeButton className="ml-5 justify-start" slug={slug} />
            </div>
          </aside>
        </div>
        {toc.length > 0 && <MobileTableOfContents toc={toc} />}
        <Footer />
      </Providers>
      <Suspense fallback={<div className="mt-8"><Skeleton className="h-24 w-full" /></div>}>
        <CommentSection slug={slug} />
      </Suspense>
    </>
  )
}

export default Page

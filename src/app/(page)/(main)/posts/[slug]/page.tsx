import type { Metadata } from 'next'

import type { BlogPosting, WithContext } from 'schema-dts'
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
import { MY_NAME } from '~/config/constants'
import { getAllPosts, getPostBySlug } from '~/lib/content'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils/get-base-url'

export async function generateMetadata(props: PageProps<'/posts/[slug]'>): Promise<Metadata> {
  const { params } = props
  const { slug } = await params

  const post = await getPostBySlug(slug)

  if (!post)
    return {}

  return createMetadata({
    pathname: `/posts/${slug}`,
    title: post.title,
    description: post.intro ?? '',
    openGraph: {
      type: 'article',
      publishedTime: post.date ?? undefined,
      modifiedTime: post.modifiedTime ?? undefined,
    },
  })
}
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

async function Page(props: PageProps<'/posts/[slug]'>) {
  const { params } = props
  const { slug } = await params

  const post = await getPostBySlug(slug)
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/posts/${slug}`

  if (!post) {
    notFound()
  }

  const { title, intro, date, modifiedTime } = post
  const content = await post.content()
  const toc: any[] = []

  const { content: _contentFn, ...postRest } = post

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': intro,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url,
    },
    'image': `/og/posts/${post.slug}/image.webp`,
    'datePublished': date ?? '',
    'dateModified': modifiedTime ?? '',
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
      <Providers post={postRest as any}>
        <Header intro={intro ?? ''} content={content} />
        <div className="mt-8 flex w-full flex-col justify-between gap-2 overflow-visible lg:flex-row">
          <article className="w-full sm:px-4">
            <Mdx code={content} />
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

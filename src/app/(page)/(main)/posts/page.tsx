import type { Metadata, ResolvingMetadata } from 'next'
import type { Blog, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import FilteredPosts from '~/components/filtered-posts'
import PageTitle from '~/components/page-title'
import { SITE_NAME, SITE_URL } from '~/config/constants'

const title = '文章'
const url = '/blog'
const description = '分享我的编程学习笔记、生活小思考，希望能网友们一起共同成长。'

export async function generateMetadata(
  _props: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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
      title,
      description,
    },
    twitter: {
      ...previousTwitter,
      title,
      description,
    }
  }
}

async function Page() {
  const posts = allPosts
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    'name': title,
    description,
    url,
    'author': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
    'blogPost': allPosts.map(post => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'url': `${url}/${post.slug}`,
      'datePublished': post.date,
      'dateModified': post.modifiedTime,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={description} />
      <FilteredPosts posts={posts} />
    </>
  )
}

export default Page

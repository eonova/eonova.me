import type { Metadata, ResolvingMetadata } from 'next'
import type { Blog, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import FilteredPosts from '~/components/filtered-posts'
import PageTitle from '~/components/page-title'
import { SITE_NAME, SITE_URL } from '~/config/constants'

const title = '博客'
const url = '/blog'
const description = '欢迎来到我的博客！在这里，我会分享生活中的点滴感悟，从日常小事里汲取的温暖与力量，也会复盘个人成长的关键时刻，那些迷茫、坚持与突破，都是宝贵的人生财富。作为前端技术爱好者，我还会分享各类技术干货，如 JavaScript 的实用技巧、CSS 的奇思妙想布局，希望能为同行提供新思路，和大家一起在技术海洋里畅游，共同成长。'

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

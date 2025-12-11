import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import PostCards from '~/components/pages/posts/post-cards'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { MY_NAME } from '~/config/constants'
import { getLatestPosts } from '~/lib/content'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

const title = '文章'
const url = '/posts'
const description = '分享我的编程学习笔记、生活小思考，希望能和网友们一起共同成长。'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: url,
    title,
    description,
  })
}

export const dynamic = 'force-static'

async function Page() {
  const posts = await getLatestPosts()

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    'name': title,
    description,
    url,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': posts.map((post, index) => ({
        '@type': 'BlogPosting',
        'headline': post.title,
        'url': `${url}/${post.slug}`,
        'datePublished': post.date ?? '',
        'dateModified': post.modifiedTime ?? '',
        'position': index + 1,
      })),
    },
    'isPartOf': {
      '@type': 'WebSite',
      'name': MY_NAME,
      'url': getBaseUrl(),
    },
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      {posts.length === 0 ? <div className="my-24 text-center text-xl">暂无结果</div> : null}
      <PostCards posts={posts} />
    </>
  )
}

export default Page

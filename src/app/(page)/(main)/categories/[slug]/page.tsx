import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import PageTitle from '~/components/page-title'
import { SITE_URL } from '~/config/constants'
import { Category } from '~/types/categories'

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

  const post = allPosts.find(p => p.slug === slug)

  if (!post)
    return {}

  const { date, modifiedTime, title, summary } = post

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(modifiedTime).toISOString()
  const url = `/categories/${slug}`

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

  const posts = allPosts.filter(p => {
    console.log('----------------', p.categories.includes(slug))
    console.log('-----demo--------', p.categories.includes('tech'))
    return p.categories.includes(slug)
  })
  const url = `${SITE_URL}/categories/${slug}`

  if (!posts) {
    notFound()
  }

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'headline': slug,
    'name': slug,
    'description': `分类-${Category[slug as keyof typeof Category]}`,
    url,
    'image': `${SITE_URL}/og/${slug}`,
  }

  console.log('===================', posts)
  const title = `分类 - ${Category[slug as keyof typeof Category]}`
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={''} />
      <p>{posts.toString()}</p>
    </>
  )
}

export default Page

import type { Metadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'

import { allPages } from 'mdx/generated'
import { notFound } from 'next/navigation'
import Mdx from '~/components/mdx'
import PageTitle from '~/components/page-title'
import {
  SITE_DESCRIPTION,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'

export async function generateMetadata(): Promise<Metadata> {
  const title = '关于'
  const description = '👋 嗨！我是 LeoStar，一个热爱网页开发的学生。'
  const url = '/about'

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      type: 'profile',
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  }
}

async function Page() {
  const title = '关于'
  const description = '👋 嗨！我是 LeoStar，一个热爱网页开发的学生。'
  const url = '/about'
  const page = allPages.find(p => p.slug === 'about')

  const jsonLd: WithContext<AboutPage> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': title,
    description,
    url,
    'mainEntity': {
      '@type': 'Person',
      'name': SITE_NAME,
      'description': SITE_DESCRIPTION,
      'url': SITE_URL,
      'sameAs': [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL],
    },
  }

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page

import type { Metadata, ResolvingMetadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'
import dynamic from 'next/dynamic'
import Bento from '~/components/pages/about/bento'
import PageTitle from '~/components/shared/page-title'
import {
  SITE_DESCRIPTION,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'

const BounceCards = dynamic(() => import('~/components/pages/about/bounce-cards'))

const title = '关于'
const description = '👋 嗨！我是 Eonova'
const url = `${SITE_URL}/about`

export async function generateMetadata(_props: any, parent: ResolvingMetadata): Promise<Metadata> {
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
      type: 'profile',
      title,
      description,
    },
    twitter: {
      ...previousTwitter,
      title,
      description,
    },
  }
}

const images = [
  '/images/about/intro-1.jpg',
  '/images/about/intro-4.jpg',
  '/images/about/intro-5.jpg',
  '/images/about/intro-2.jpg',
  '/images/about/intro-3.jpg',
]

async function Page() {
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
      'sameAs': [SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={description} />
      <BounceCards
        className="custom-class"
        images={images}
        animationDelay={0.3}
        animationStagger={0.12}
        easeType="elastic.out(1, 0.5)"
        transformStyles={[
          'rotate(5deg) translate(-150px)',
          'rotate(0deg) translate(-70px)',
          'rotate(-5deg)',
          'rotate(5deg) translate(70px)',
          'rotate(-5deg) translate(150px)',
        ]}
      />
      <Bento />
    </>
  )
}

export default Page

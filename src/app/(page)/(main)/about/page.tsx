import type { Metadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'
import dynamic from 'next/dynamic'
import Bento from '~/components/pages/about/bento'
import { Donate } from '~/components/shared/donate'
import PageTitle from '~/components/shared/page-title'
import { BOUNCE_IMAGES } from '~/config/about-profiles'
import {
  SITE_DESCRIPTION,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'
import { createMetadata } from '~/config/metadata'
import { getBaseUrl } from '~/utils/get-base-url'

const BounceCards = dynamic(() => import('~/components/pages/about/bounce-cards'))

const title = '关于'
const description = '👋 嗨！我是 Eonova'
const url = `${SITE_URL}/about`

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/about',
    title,
    description,
    openGraph: {
      type: 'profile',
    },
  })
}

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
      'url': getBaseUrl(),
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
        images={BOUNCE_IMAGES}
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
      <div className="mt-16 flex justify-center">
        <Donate />
      </div>
    </>
  )
}

export default Page

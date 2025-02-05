import type { Metadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'

import { allPages } from 'mdx/generated'
import { notFound } from 'next/navigation'
import BounceCards from '~/components/about/bounce-cards'
import Mdx from '~/components/mdx'
import PageTitle from '~/components/page-title'
import PixelTransition from '~/components/pixel-transition'
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

const images = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
]

const transformStyles = [
  'rotate(5deg) translate(-150px)',
  'rotate(0deg) translate(-70px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(70px)',
  'rotate(-5deg) translate(150px)',
]

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
      <BounceCards
        className="custom-class"
        images={images}
        animationDelay={0.3}
        animationStagger={0.12}
        easeType="elastic.out(1, 0.5)"
        transformStyles={transformStyles}
      />
      <Mdx code={code} />
      <PixelTransition
        firstContent={(
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
            alt="default pixel transition content, a cat!"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        secondContent={(
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#111',
            }}
          >
            <p style={{ fontWeight: 900, fontSize: '3rem', color: '#ffffff' }}>Meow!</p>
          </div>
        )}
        gridSize={12}
        pixelColor="#ffffff"
        animationStepDuration={0.4}
        className="custom-pixel-card"
      />
    </>
  )
}

export default Page

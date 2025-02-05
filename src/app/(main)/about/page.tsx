import type { Metadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'

import { allPages } from 'mdx/generated'
import { notFound } from 'next/navigation'
import TextPressure from '~/components/about/ascii-text'
import ASCIIText from '~/components/about/ascii-text'
import BounceCards from '~/components/about/bounce-cards'
import IntroCard from '~/components/about/initro-card'
import Mdx from '~/components/mdx'
import PageTitle from '~/components/page-title'
import QuoteCard from '~/components/quote-card'
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
      <ul className="relative w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-5 mt-10 ">
        <div className="overflow-hidden relative  col-span-1 md:col-span-4 lg:col-span-8 h-80 rounded-3xl  bg-black/10 dark:bg-[#1d1e22]/30 backdrop-blur-xs p-0!  border dark:border-white/10 border-black/5">
          <ASCIIText
            text="LeoStar"
            enableWaves
            asciiFontSize={4}
          />
        </div>
        <IntroCard className="col-span-1 md:col-span-2 lg:col-span-4 rounded-2xl lg:rounded-3xl
              bg-black/10 dark:bg-[#1d1e22]/30 backdrop-blur-xs
              hover:scale-[1.02] transition-transform duration-300 active:scale-95
              will-change-transform backface-visibility-hidden"
        >
          111
        </IntroCard>
        <QuoteCard className="col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl" />
        <QuoteCard className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl" />
        <IntroCard className="col-span-1 md:col-span-2 lg:col-span-5 rounded-3xl bg-black/10 dark:bg-[#1d1e22]/30 backdrop-blur-xs">
          111
        </IntroCard>
        <IntroCard className="col-span-1 md:col-span-4 lg:col-span-8 h-80 rounded-3xl  bg-black/10 dark:bg-[#1d1e22]/30 backdrop-blur-xs" subheading="约定" title="六年之约" desc="与jack叔叔的约定">

        </IntroCard>
      </ul>
    </>
  )
}

export default Page

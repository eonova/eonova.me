import type { Metadata } from 'next'
import type { WebSite, WithContext } from 'schema-dts'
import AboutMe from '~/components/pages/home/about-me'
import GetInTouch from '~/components/pages/home/get-in-touch'
import Hero from '~/components/pages/home/hero'
import LatestNews from '~/components/pages/home/latest-news'
import SelectedProjects from '~/components/pages/home/selected-projects'
import JsonLd from '~/components/shared/json-ld'
import { MY_NAME, SITE_DESCRIPTION, SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_NAME, SITE_X_URL, SITE_YOUTUBE_URL } from '~/config/constants'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    root: true,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  })
}

export default function Home() {
  const url = getBaseUrl()
  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url,
    'name': SITE_NAME,
    'description': SITE_DESCRIPTION,
    url,
    'publisher': {
      '@type': 'Person',
      'name': MY_NAME,
      url,
      'sameAs': [SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL],
    },
    'copyrightYear': new Date().getFullYear(),
    'dateCreated': '2025-01-28T00:00:00Z',
    'dateModified': new Date().toISOString(),
  }
  return (
    <>
      <JsonLd json={jsonLd} />
      <Hero />
      <LatestNews />
      <SelectedProjects />
      <AboutMe />
      <GetInTouch />
    </>
  )
}

export const dynamic = 'force-static'

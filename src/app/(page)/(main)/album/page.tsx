import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import WaterfallGallery from '~/components/pages/album/masonry-gallery'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import {
  SITE_DESCRIPTION,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils/get-base-url'

const title = '相册'
const description = '记录生活点点滴滴✨'
const url = '/album'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/album',
    title,
    description,
    openGraph: {
      type: 'profile',
    },
  })
}

function Album() {
  const jsonLd: WithContext<WebPage> = {
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
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <WaterfallGallery itemsPerPage={12} />
    </>
  )
}

export default Album

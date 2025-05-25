import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import WaterfallGallery from '~/components/pages/album/masonry-gallery'
import PageTitle from '~/components/shared/page-title'
import { SITE_DESCRIPTION, SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_NAME, SITE_URL, SITE_X_URL, SITE_YOUTUBE_URL } from '~/config/constants'

const title = '相册'
const description = '记录生活点点滴滴✨'
const url = '/album'

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

const Album: React.FC = () => {
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
      <PageTitle
        title={title}
        description={description}
      />
      <WaterfallGallery
        itemsPerPage={12}
      />
    </>
  )
}

export default Album

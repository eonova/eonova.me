import type { Metadata, ResolvingMetadata } from 'next'
import NeoDBContent from '~/components/pages/neodb/content'
import PageTitle from '~/components/shared/page-title'
import { SITE_URL } from '~/config/constants'

const title = '书影番'
const description = '我的收集与标记📚🎬🎮'

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}

  return {
    title,
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      ...previousOpenGraph,
      url: SITE_URL,
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

function Page() {
  return (
    <>
      <PageTitle title={title} description={description} />
      <NeoDBContent />
    </>
  )
}

export default Page

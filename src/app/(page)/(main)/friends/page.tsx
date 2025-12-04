import type { Metadata, ResolvingMetadata } from 'next'
import FriendsList from '~/components/pages/friends/friends-list'
import PageTitle from '~/components/shared/page-title'
import { SITE_URL } from '~/config/constants'

const title = '友链'
const description = '感谢你愿意和我做朋友🌈'

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
      <FriendsList />
    </>
  )
}

export default Page

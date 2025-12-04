import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import FriendsList from '~/components/pages/friends/friends-list'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { createMetadata } from '~/config/metadata'
import { getBaseUrl } from '~/utils'

const title = '友链'
const description = '感谢你愿意和我做朋友🌈'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/friends',
    title,
    description,
    openGraph: {
      type: 'profile',
    },
  })
}

function Page() {
  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    description,
    'url': `${getBaseUrl()}/friends`,
  }
  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <FriendsList />
    </>
  )
}

export default Page

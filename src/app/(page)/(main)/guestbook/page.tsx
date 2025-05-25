import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import PageTitle from '~/components/shared/page-title'
import { SITE_URL } from '~/config/constants'
import { getSession } from '~/lib/auth'

import { flags } from '~/lib/env'

import MessageBox from './message-box'
import Messages from './messages'
import Pinned from './pinned'
import SignIn from './sign-in'

const title = '留言板'
const description = '有任何问题可以给我留言'
const url = '/guestbook'

export async function generateMetadata(
  _props: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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

async function Page() {
  if (!flags.auth)
    return null
  const session = await getSession()

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    description,
    url,
    'isPartOf': {
      '@type': 'WebSite',
      'name': title,
      'url': SITE_URL,
    },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle
        title="留言板"
        description="在我的留言板上留下您的想法。您可以在这里告诉我任何事情！"
      />
      <div className="mx-auto max-w-xl space-y-10">
        <Pinned />
        {session ? <MessageBox user={session.user} /> : <SignIn />}
        <Messages />
      </div>
    </>
  )
}

export default Page

import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import MessageBoard from '~/components/pages/guestbook/message-board'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { MY_NAME } from '~/config/constants'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils/get-base-url'

const title = '留言板'
const description = '在我的留言板上留下您的想法。您可以在这里告诉我任何事情！'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/guestbook',
    title,
    description,
  })
}
function Page() {
  const url = `${getBaseUrl()}/guestbook`

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    description,
    url,
    'isPartOf': {
      '@type': 'WebSite',
      'name': MY_NAME,
      'url': getBaseUrl(),
    },
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <MessageBoard />
    </>
  )
}

export default Page

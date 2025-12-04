import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import TalkList from '~/components/pages/talk/list'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { MY_NAME } from '~/config/constants'
import { createMetadata } from '~/config/metadata'
import { TalkProvider } from '~/hooks/use-talk'
import { getBaseUrl } from '~/utils'

const title = '碎碎念'
const description = '谢谢你愿意听我诉说🎈'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/talk',
    title,
    description,
  })
}

function Page() {
  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    description,
    'url': `${getBaseUrl()}/talk`,
    'isPartOf': {
      '@type': 'WebSite',
      'name': MY_NAME,
      'url': getBaseUrl(),
    },
  }
  return (
    <TalkProvider>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <div className="mb-1 h-1 hidden lg:block"></div>
      <TalkList />
    </TalkProvider>
  )
}

export default Page

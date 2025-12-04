import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import NeoDBContent from '~/components/pages/neodb/content'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { createMetadata } from '~/config/metadata'
import { getBaseUrl } from '~/utils'

const title = '书影番'
const description = '我的收集与标记📚🎬🎮'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/neodb',
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
    'url': `${getBaseUrl()}/neodb`,
  }
  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <NeoDBContent />
    </>
  )
}

export default Page

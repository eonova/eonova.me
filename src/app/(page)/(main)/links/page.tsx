import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import Data from '@/data/links/index.json'
import { Separator } from '~/components/base'
import BackgroundFont from '~/components/shared/background-font'
import JsonLd from '~/components/shared/json-ld'
import LinkCard from '~/components/shared/link-card'
import PageTitle from '~/components/shared/page-title'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

const title = '收藏夹'
const description = '我收藏的一些宝藏网站'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/links',
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
    'url': `${getBaseUrl()}/links`,
  }
  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      {
        Data.categories.map(
          (item, idx) =>
            (
              <div className="mt-8" key={item.categoryName}>
                <BackgroundFont
                  className="text-7xl text-gray-500/50 dark:text-white/50"
                  lineHeight="1.2"
                >
                  {item.categoryName}
                </BackgroundFont>
                <div className="pb-10 text-gray-600">
                  <div className="mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5">
                    {item.websites.map(i => (
                      <LinkCard props={i} key={i.title} className="p-6" />
                    ))}
                  </div>
                </div>
                {Data.categories.length - 1 !== idx && <Separator />}
              </div>
            ),
        )
      }
    </>
  )
}

export default Page

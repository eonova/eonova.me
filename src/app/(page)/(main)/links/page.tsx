import type { Metadata, ResolvingMetadata } from 'next'
import Data from '@/data/links/index.json'
import { Separator } from '~/components/base'
import BackgroundFont from '~/components/shared/background-font'
import LinkCard from '~/components/shared/link-card'
import PageTitle from '~/components/shared/page-title'
import { SITE_URL } from '~/config/constants'

const title = '收藏夹'
const description = '我收藏的一些宝藏网站'

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
      {Data.categories.map((item, idx) => {
        return (
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
        )
      })}
    </>
  )
}

export default Page

import Data from '@/data/links/index.json'
import { Separator } from '~/components/base'
import BackgroundFont from '~/components/shared/background-font'
import LinkCard from '~/components/shared/link-card'
import PageTitle from '~/components/shared/page-title'

function Page() {
  return (
    <>
      <PageTitle title="收藏夹" description="我收藏的一些宝藏网站" />
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

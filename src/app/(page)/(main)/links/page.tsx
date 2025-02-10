import BackgroundFont from '~/components/background-font'
import { Separator } from '~/components/base'
import LinkCard from '~/components/link-card'
import PageTitle from '~/components/page-title'
import Data from '../../../../../data/links/index.json'

const Links: React.FC = () => {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cn-fontsource-ding-talk-jin-bu-ti-regular/font.css"></link>
      <PageTitle
        title="收藏夹"
        description="我收藏的一些宝藏网站"
      />
      {
        Data.categories.map((item, idx) => {
          return (
            <div className="mt-8" key={item.categoryName}>
              <BackgroundFont className="text-7xl text-gray-500/50 dark:text-white/50" lineHeight="1.2">{item.categoryName}</BackgroundFont>
              <div className=" text-gray-600 pb-10">
                <div className="mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-x-5">
                  {
                    item.websites.map(i => (
                      <LinkCard props={i} key={i.title} className="p-6" />
                    ))
                  }
                </div>
              </div>
              {Data.categories.length - 1 !== idx && <Separator />}
            </div>
          )
        })
      }
    </>
  )
}

export default Links

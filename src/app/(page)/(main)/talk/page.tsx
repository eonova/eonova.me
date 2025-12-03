import TalkList from '~/components/pages/talk/list'
import PageTitle from '~/components/shared/page-title'
import { TalkProvider } from '~/hooks/use-talk'

const title = '碎碎念'
const description = '谢谢你愿意听我诉说🎈'

function Page() {
  return (
    <TalkProvider>
      <PageTitle title={title} description={description} />
      <div className="mb-1 h-1 hidden lg:block"></div>
      <TalkList />
    </TalkProvider>
  )
}

export default Page

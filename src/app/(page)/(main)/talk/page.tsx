import type { Metadata, ResolvingMetadata } from 'next'
import TalkList from '~/components/pages/talk/list'
import PageTitle from '~/components/shared/page-title'
import { TalkProvider } from '~/hooks/use-talk'

const title = '碎碎念'
const url = '/talk'
const description = '谢谢你愿意听我诉说🎈'

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
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
    <TalkProvider>
      <PageTitle title={title} description={description} />
      <div className="mb-1 h-1 hidden lg:block"></div>
      <TalkList />
    </TalkProvider>
  )
}

export default Page

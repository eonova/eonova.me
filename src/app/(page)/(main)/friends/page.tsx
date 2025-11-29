import FriendsList from '~/components/pages/friends/friends-list'
import PageTitle from '~/components/shared/page-title'

const title = '友链'
const description = '感谢你愿意和我做朋友🌈'

function Page() {
  return (
    <>
      <PageTitle title={title} description={description} />
      <FriendsList />
    </>
  )
}

export default Page

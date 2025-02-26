import PageTitle from '~/components/page-title'
import TalkList from '~/components/talk/list'

const title = '碎碎念'
const description = '谢谢你愿意听我诉说🎈'

const Talk: React.FC = () => {
  return (
    <>
      <PageTitle
        title={title}
        description={description}
      />
      <TalkList />
    </>
  )
}

export default Talk

import PageTitle from '~/components/page-title'
import TalkBox from '~/components/talk/box'

interface TalkProps {

}

const title = '碎碎念'
const description = '谢谢你愿意听我诉说🎈'

const Talk: React.FC<TalkProps> = () => {
  return (
    <>
      <PageTitle
        title={title}
        description={description}
      />
      <div className="w-full flex flex-col gap-14">
        <TalkBox>
          <p className="text-sm">今天天气真好，和朋友一起去玩了！🧺☀️</p>
        </TalkBox>
        <TalkBox>
          <p className="text-sm">今天天气真好☀️</p>
        </TalkBox>
      </div>
    </>
  )
}

export default Talk

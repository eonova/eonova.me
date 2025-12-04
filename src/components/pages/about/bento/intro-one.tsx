import BackgroundFont from '../../../shared/background-font'
import DoubleCard from './double-card'
import IntroCard from './intro-card'

const IntroOne: React.FC = () => {
  return (
    <>
      <IntroCard
        className="font-dingtalk col-span-1 h-[195px] rounded-3xl bg-indigo-500 text-white backdrop-blur-xs md:col-span-2 lg:col-span-5 lg:rounded-3xl"
        title="我是谁"
        desc="一名前端开发Coder、UI设计狮"
        isColor
      >
        <div className="font-dingtalk text-indigo-100 mt-3">
          <h2>你好，很高兴认识你👋</h2>
          <p>我是 Eonova</p>
        </div>
        <BackgroundFont className="absolute bottom-0 left-20 text-8xl text-white/20 sm:text-[130px]">
          EONOVA
        </BackgroundFont>
      </IntroCard>
      <DoubleCard className="col-span-1 flex flex-col justify-between gap-5 md:col-span-2 lg:col-span-3" />
    </>
  )
}

export default IntroOne

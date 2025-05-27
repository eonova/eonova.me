import BackgroundFont from '../../../shared/background-font'
import DoubleCard from './double-card'
import IntroCard from './intro-card'

const IntroOne: React.FC = () => {
  return (
    <>
      <IntroCard
        className="h-[195px] col-span-1 md:col-span-2 lg:col-span-5 rounded-3xl bg-[#3E5DFF] lg:rounded-3xl backdrop-blur-xs text-white font-world"
        title="我是谁"
        desc="一名前端开发Coder、UI设计狮"
        isColor
      >
        <div className="mt-3 font-world">
          <h2>你好，很高兴认识你👋</h2>
          <p>我是 Eonova</p>
        </div>
        <BackgroundFont className=" absolute text-white/20 left-20 bottom-0 text-8xl sm:text-[130px]">EONOVA</BackgroundFont>
      </IntroCard>
      <DoubleCard className="flex flex-col gap-5 justify-between col-span-1 md:col-span-2 lg:col-span-3" />
    </>
  )
}

export default IntroOne

import { DATE_BIRTH, PROFESSION } from "~/config/about";
import BackgroundFont from "../background-font";
import IntroCard from "./intro-card";

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
          <p>我是 LeoStar</p>
        </div>
        <BackgroundFont className=" absolute text-white/20 left-20 bottom-0 text-8xl sm:text-[130px]">LEOSTAR</BackgroundFont>
      </IntroCard>
      <div className="flex flex-col gap-5 justify-between col-span-1 md:col-span-2 lg:col-span-3">
        <IntroCard
          className="h-[90px] w-full rounded-3xl bg-[#FDE047] backdrop-blur-xs flex items-center justify-between font-world text-white"
          isColor
        >
          <h2 className="text-2xl">生于</h2>
          <p className="text-[32px]">{DATE_BIRTH}</p>
        </IntroCard>
        <IntroCard
          className="h-[90px] w-full rounded-3xl bg-[#FDBA74] backdrop-blur-xs flex items-center justify-between font-world text-white"
          isColor
        >
          <h2 className="text-2xl">专业</h2>
          <p className="text-[32px]">{PROFESSION}</p>
        </IntroCard>
      </div>
    </>
  );
}

export default IntroOne;

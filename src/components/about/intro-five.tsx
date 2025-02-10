import QuoteCard from "../quote-card";
import IntroCard from "./intro-card";

const IntroFive: React.FC= () => {
  return (
    <>
      <IntroCard
        className="h-56 col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl bg-[#FDE047] backdrop-blur-xs text-[110px] flex justify-center items-center"
        isColor
      >
        😆
      </IntroCard>
      <QuoteCard className="h-56 col-span-1 md:col-span-2 lg:col-span-5 rounded-3xl backdrop-blur-xs" by="梭罗">人生是旷野，不是轨道。</QuoteCard>
    </>
  );
}

export default IntroFive;

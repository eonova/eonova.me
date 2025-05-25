import { cn } from '~/utils'
import Video from '../video'
import IntroCard from './intro-card'

const IntroThree: React.FC = () => {
  return (
    <>
      <IntroCard
        className="h-[260px] col-span-1 md:col-span-1 lg:col-span-3 rounded-3xl backdrop-blur-xs p-5 text-white"
        subheading="幸福感"
        title="捕捉美好瞬间"
        desc="感受生活"
        isColor
      >
        <div className={
          cn('absolute z-[-2] w-full h-full left-0 top-0')
        }
        >
          <Video
            className="min-w-[260px] w-full"
            videoSrc="https://img.leostar.top/study/08512629bf6cd862577020adee823f71.mp4"
            videoSecondSrc="/videos/life.mp4"
            fallbackImageSrc="/images/about/life.jpg"
          />
        </div>
      </IntroCard>
      <IntroCard
        className="h-[165px] sm:h-[260px] col-span-1 md:col-span-3 lg:col-span-5 rounded-3xl backdrop-blur-xs p-5 text-white"
        subheading="爱好"
        title="GUITAR 吉他"
        desc="乐器"
        isColor
      >
        <div className={cn('absolute z-[-2] w-full h-full left-0 top-0')}>
          <Video
            className="min-w-[260px] w-full min-h-full"
            videoSrc="https://img.leostar.top/study/02e691e904ec58bba00d690dbb457fd6.mp4"
            videoSecondSrc="/videos/guitar.mp4"
            fallbackImageSrc="/images/about/guitar.jpg"
          />
        </div>
      </IntroCard>
    </>
  )
}

export default IntroThree

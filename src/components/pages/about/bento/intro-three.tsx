import { cn } from '~/utils'
import Video from '../video'
import IntroCard from './intro-card'

const IntroThree: React.FC = () => {
  return (
    <>
      <IntroCard
        className="col-span-1 h-[260px] rounded-3xl p-5 text-white backdrop-blur-xs md:col-span-1 lg:col-span-3"
        subheading="幸福感"
        title="捕捉美好瞬间"
        desc="感受生活"
        isColor
      >
        <div className={cn('absolute top-0 left-0 z-[-2] h-full w-full')}>
          <Video
            className="w-full min-w-[260px]"
            videoSrc="https://img.eonova.me/upload/life.mp4"
            videoSecondSrc="/videos/life.mp4"
            fallbackImageSrc="/images/about/life.jpg"
          />
        </div>
      </IntroCard>
      <IntroCard
        className="col-span-1 h-[165px] rounded-3xl p-5 text-white backdrop-blur-xs sm:h-[260px] md:col-span-3 lg:col-span-5"
        subheading="爱好"
        title="GUITAR 吉他"
        desc="乐器"
        isColor
      >
        <div className={cn('absolute top-0 left-0 z-[-2] h-full w-full')}>
          <Video
            className="min-h-full w-full min-w-[260px]"
            videoSrc="https://img.eonova.me/upload/guitar.mp4"
            videoSecondSrc="/videos/guitar.mp4"
            fallbackImageSrc="/images/about/guitar.jpg"
          />
        </div>
      </IntroCard>
    </>
  )
}

export default IntroThree

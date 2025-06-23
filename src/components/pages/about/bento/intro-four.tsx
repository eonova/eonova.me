import Image from 'next/image'
import { LINK_MUSIC } from '~/config/about-profiles'
import IntroCard from './intro-card'

interface IntroFourProps {}

const IntroFour: React.FC<IntroFourProps> = () => {
  return (
    <>
      <IntroCard
        className="col-span-1 h-56 rounded-3xl text-white backdrop-blur-xs md:col-span-2 lg:col-span-4 lg:h-64"
        subheading="番剧"
        title="Charlotte"
        desc="友利奈绪"
        isColor
      >
        <Image
          className="absolute top-0 left-0 z-[-1] h-full w-full"
          src="/images/about/ylnx.jpg"
          alt="友利奈绪"
          width={400}
          height={200}
        />
      </IntroCard>
      <IntroCard
        className="col-span-1 h-60 rounded-3xl text-white backdrop-blur-xs md:col-span-1 lg:col-span-2 lg:h-64"
        subheading="运动"
        title="Sport"
        desc="羽毛球"
        isColor
      >
        <Image
          className="absolute top-0 left-0 z-[-1] w-full sm:h-full"
          src="/images/about/badminton.png"
          alt="羽毛球"
          width={200}
          height={150}
        />
      </IntroCard>
      <IntroCard
        className="font-world col-span-1 h-60 overflow-hidden rounded-3xl text-white backdrop-blur-xs md:col-span-1 lg:col-span-2 lg:h-64"
        subheading="音乐"
        title="Music"
        desc={LINK_MUSIC}
        isColor
      >
        <Image
          className="absolute top-0 left-0 z-[-1] w-full sm:h-full"
          src="/images/about/music.png"
          alt="音乐"
          width={300}
          height={150}
        />
      </IntroCard>
    </>
  )
}

export default IntroFour

import Image from 'next/image'
import Link from 'next/link'
import {
  MBTI_PERSONALITY,
  MBTI_PERSONALITY_NAME,
  STAR_SIGN,
  STAR_SIGN_NAME,
} from '~/config/about-profiles'
import IntroCard from './intro-card'

const IntroTwo: React.FC = () => {
  return (
    <>
      <IntroCard
        className="col-span-1 bg-slate-800/90 text-emerald-300 h-[180px] rounded-3xl backdrop-blur-xs md:col-span-2 lg:col-span-4"
        subheading="性格"
        isColor
      >
        <div className="mt-2">
          <h2 className="text-3xl font-bold">{MBTI_PERSONALITY_NAME}</h2>
          <p className="text-3xl font-bold text-[#33A474]">{MBTI_PERSONALITY}</p>
        </div>
        <Image
          className="absolute right-0 bottom-[-5] -scale-x-100 duration-300 hover:rotate-6"
          src="/images/about/enfp.svg"
          alt={MBTI_PERSONALITY}
          width={120}
          height={200}
        />
        <div className="absolute bottom-5 left-10 text-sm dark:text-gray-300/50">
          在
          {' '}
          <Link
            target="black"
            className="duration-300 hover:text-black/50 dark:hover:text-white"
            href="https://www.16personalities.com/"
          >
            16personalities
          </Link>
          {' '}
          了解更多关于
          <Link
            target="black"
            className="duration-300 hover:text-black/50 dark:hover:text-white"
            href={`https://www.16personalities.com/ch/${MBTI_PERSONALITY}-%E4%BA%BA%E6%A0%BC`}
          >
            {MBTI_PERSONALITY_NAME}
          </Link>
        </div>
      </IntroCard>
      <IntroCard
        className="col-span-1 h-[180px] rounded-3xl bg-rose-400/80 text-black backdrop-blur-xs md:col-span-2 lg:col-span-4"
        subheading="星座"
        isColor
      >
        <div className="mt-2">
          <p className="text-3xl font-bold">{STAR_SIGN}</p>
          <p className="text-3xl font-bold text-rose-900/80">{STAR_SIGN_NAME}</p>
        </div>
        <Image
          className="absolute right-5 bottom-[-15] duration-300 hover:rotate-6"
          src="/images/about/leo.png"
          alt={MBTI_PERSONALITY}
          width={160}
          height={100}
        />
        <div className="absolute bottom-5 left-10 text-sm text-black/80">
          在
          {' '}
          <Link
            target="black"
            className="text-black/80 duration-300 hover:text-black/40"
            href="https://www.xzw.com/fortune/"
          >
            星座屋
          </Link>
          {' '}
          了解更多关于
          <Link
            target="black"
            className="text-black/80 duration-300 hover:text-black/40"
            href="https://www.xzw.com/fortune/leo/"
          >
            {STAR_SIGN}
          </Link>
        </div>
      </IntroCard>
    </>
  )
}

export default IntroTwo

import type { Metadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'

import Image from 'next/image'
import Link from 'next/link'
import AppointProgress from '~/components/about/appoint-progress'
import BounceCards from '~/components/about/bounce-cards'
import IntroCard from '~/components/about/intro-card'
import { VelocityScroll } from '~/components/about/scrollbasedvelocity'
import BackgroundFont from '~/components/background-font'
import Video from '~/components/mdx/video'
import PageTitle from '~/components/page-title'
import QuoteCard from '~/components/quote-card'
import {
  APPOINT_END_DATE,
  APPOINT_START_DATE,
  DATE_BIRTH,
  MBTI_PERSONALITY,
  MBTI_PERSONALITY_NAME,
  PROFESSION,
  STAR_SIGN,
  STAR_SIGN_NAME,
} from '~/config/about'
import {
  SITE_DESCRIPTION,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'

export async function generateMetadata(): Promise<Metadata> {
  const title = '关于'
  const description = '👋 嗨！我是 LeoStar，，一个爱捣鼓的前端开发。'
  const url = '/about'

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      type: 'profile',
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  }
}

const images = [
  '/images/about/intro-1.jpg',
  '/images/about/intro-4.jpg',
  '/images/about/intro-5.jpg',
  '/images/about/intro-2.jpg',
  '/images/about/intro-3.jpg',
]

const transformStyles = [
  'rotate(5deg) translate(-150px)',
  'rotate(0deg) translate(-70px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(70px)',
  'rotate(-5deg) translate(150px)',
]

async function Page() {
  const title = '关于'
  const description = '👋 嗨！我是 LeoStar。'
  const url = '/about'

  const jsonLd: WithContext<AboutPage> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': title,
    description,
    url,
    'mainEntity': {
      '@type': 'Person',
      'name': SITE_NAME,
      'description': SITE_DESCRIPTION,
      'url': SITE_URL,
      'sameAs': [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={description} />
      <BounceCards
        className="custom-class"
        images={images}
        animationDelay={0.3}
        animationStagger={0.12}
        easeType="elastic.out(1, 0.5)"
        transformStyles={transformStyles}
      />
      <ul className="relative w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-5 mt-5">
        <>
          <IntroCard
            className="h-[195px] col-span-1 md:col-span-2 lg:col-span-5 rounded-2xl bg-[#3E5DFF] lg:rounded-3xl backdrop-blur-xs font-mono text-white"
            title="我是谁"
            desc="一名前端开发Coder、UI设计狮"
            isColor
          >
            <div className="mt-3">
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
        <>
          <IntroCard
            className="h-[180px] col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl backdrop-blur-xs"
            subheading="性格"
          >
            <div className="mt-2">
              <h2 className="text-3xl font-bold">{MBTI_PERSONALITY_NAME}</h2>
              <p className="text-3xl font-bold text-[#33A474]">{MBTI_PERSONALITY}</p>
            </div>
            <Image className="hover:rotate-6 duration-300 -scale-x-100 absolute right-0 bottom-[-5]" src="/images/about/enfp.svg" alt={MBTI_PERSONALITY} width={120} height={200} />
            <div className="absolute bottom-5 left-10 text-sm dark:text-gray-300/50">
              在
              {' '}
              <Link target="black" className="dark:hover:text-white hover:text-black/50 duration-300" href="https://www.16personalities.com/">16personalities</Link>
              {' '}
              了解更多关于
              <Link target="black" className="dark:hover:text-white hover:text-black/50 duration-300" href={`https://www.16personalities.com/ch/${MBTI_PERSONALITY}-%E4%BA%BA%E6%A0%BC`}>{MBTI_PERSONALITY_NAME}</Link>
            </div>
          </IntroCard>
          <IntroCard
            className="h-[180px] col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl bg-[#fcb7bf] backdrop-blur-xs text-black"
            subheading="星座"
            isColor
          >
            <div className="mt-2">
              <p className="text-3xl font-bold">{STAR_SIGN}</p>
              <p className="text-3xl font-bold text-[#C78B02]">{STAR_SIGN_NAME}</p>
            </div>
            <Image className="hover:rotate-6 duration-300 absolute right-5 bottom-[-15]" src="/images/about/leo.png" alt={MBTI_PERSONALITY} width={160} height={100} />
            <div className="absolute bottom-5 left-10 text-sm text-black/80">
              在
              {' '}
              <Link target="black" className="text-black/80 hover:text-black/40 duration-300" href="https://www.xzw.com/fortune/">星座屋</Link>
              {' '}
              了解更多关于
              <Link target="black" className="text-black/80 hover:text-black/40 duration-300" href="https://www.xzw.com/fortune/leo/">{STAR_SIGN}</Link>
            </div>
          </IntroCard>
        </>
        <>
          <IntroCard
            className="h-[215px] sm:h-[250px] col-span-1 md:col-span-1 lg:col-span-3 rounded-3xl backdrop-blur-xs p-5 text-white"
            subheading="幸福感"
            title="捕捉美好瞬间"
            desc="感受生活"
            isColor
          >
            <div className="absolute top-[-15] z-[-2] w-full h-full left-0">
              <Video
                className="min-w-[260px] w-full"
                src="https://img.leostar.top/study/08512629bf6cd862577020adee823f71.mp4"
                autoPlay
                width={0}
                height={0}
                controls={false}
                preload="metadata"
                loop
                muted
              />
            </div>
          </IntroCard>
          <IntroCard
            className="h-[215px] sm:h-[250px] col-span-1 md:col-span-3 lg:col-span-5 rounded-3xl backdrop-blur-xs p-5 text-white"
            subheading="兴趣"
            title="GUITAR 吉他"
            desc="乐器"
            isColor
          >
            <div className="absolute top-[-15] sm:top-[-12] z-[-2] w-full h-full left-0">
              <Video
                className="min-w-[260px] min-h-[220px] w-full h-full"
                src="https://img.leostar.top/study/bbbbd4a6b9e766ce6aa323bc7ce09113.mp4"
                autoPlay
                width={0}
                height={0}
                controls={false}
                preload="metadata"
                loop
                muted
              />
            </div>
          </IntroCard>
        </>
        <>
          <IntroCard
            className="h-72 col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl backdrop-blur-xs text-white"
            subheading="番剧"
            title="Charlotte"
            desc="友利奈绪"
            isColor
          >
            <Image className="absolute top-0 z-[-1] left-0 w-full h-full" src="/images/about/ylnx.jpg" alt="友利奈绪" width={400} height={200} />
          </IntroCard>
          <IntroCard
            className="h-72 col-span-1 md:col-span-1 lg:col-span-2 rounded-3xl backdrop-blur-xs text-white"
            subheading="运动"
            title="羽毛球"
            desc="Sport"
            isColor
          >
            <Image className="absolute top-0 z-[-1] left-0 w-full" src="/images/about/badminton.png" alt="羽毛球" width={200} height={150} />
          </IntroCard>
          <IntroCard
            className="h-72 col-span-1 md:col-span-1 lg:col-span-2 rounded-3xl font-world  backdrop-blur-xs overflow-hidden text-white"
            subheading="音乐"
            title="华语流行"
            desc="Music"
            isColor
          >
            <Image className="absolute top-0 z-[-1] left-0 w-full" src="/images/about/music.png" alt="音乐" width={300} height={150} />
          </IntroCard>
        </>
        <>
          <IntroCard
            className="h-56 col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl bg-[#FDE047] backdrop-blur-xs text-[110px] flex justify-center items-center"
            isColor
          >
            😆
          </IntroCard>
          <QuoteCard className="h-56 col-span-1 md:col-span-2 lg:col-span-5 rounded-3xl backdrop-blur-xs" by="梭罗">人生是旷野，不是轨道。</QuoteCard>
        </>
        <VelocityScroll
          className="font-sans text-center text-3xl font-bold  text-black dark:text-white md:text-4xl"
          text="KEEP GOING LEOSTAR.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          default_velocity={5}
        />
        <IntroCard
          className="h-80 col-span-1 md:col-span-4 lg:col-span-8 dark:bg-[#1d1e22]/30 backdrop-blur-xs"
          subheading="约定"
          title="六年之约"
          desc="与jack叔叔的约定"
        >
          <div className="mt-10 flex gap-3 flex-col">
            <AppointProgress className="h-12" startDate={new Date(APPOINT_START_DATE)} endDate={new Date(APPOINT_END_DATE)} />
            <ul className="w-full flex justify-between">
              <li>
                {APPOINT_START_DATE}
              </li>
              <li>
                {APPOINT_END_DATE}
              </li>
            </ul>
          </div>
          <BackgroundFont className="z-[-1] absolute text-black/10 dark:text-white/10 bottom-0 left-20 sm:left-80 text-8xl sm:text-[130px] overflow-hidden">APPOINT</BackgroundFont>
        </IntroCard>
      </ul>
    </>
  )
}

export default Page

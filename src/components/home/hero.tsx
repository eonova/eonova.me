'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import TiltedCard from './tilted-card'
import Avatar from '../avatar'

const TEXTS = [
  {
    text: '自己拍的小照片',
    className:
      'bg-clip-text text-center text-transparent bg-linear-to-r from-[#0077ff] to-[#00e7df]'
  },
  {
    text: '看过好看的电影',
    className:
      'bg-clip-text text-center text-transparent bg-linear-to-r from-[#7f00de] to-[#ff007f]'
  },
  {
    text: '读过有所感悟的书',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#ffc900] to-[#ff1835]',
  },
  {
    text: '奇妙的代码世界',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#00e7df] to-[#0077ff]',
  },
  {
    text: '有趣的生活日常',
    className:
      'bg-clip-text text-center text-transparent bg-linear-to-r from-[#2ecc70] to-[#1ca085]'
  },
]

const SPEED = 2

const variants = {
  enter: {
    y: 100,
    opacity: 0,
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -100,
    opacity: 0,
  },
}

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % TEXTS.length)
    }, SPEED * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // 客户端渲染的完整内容
  const textItem = TEXTS[currentIndex]
  return (
    <div className='my-16 space-y-3'>
      <div className='flex justify-between gap-8'>
        <motion.div
          className="flex flex-col gap-2"
          initial={{
            y: 40,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <h1 className="flex flex-col flex-wrap text-xl font-bold sm:text-3xl">
            <div>
              我是 <Avatar className='h-12 sm:h-16 md:h-18' /> ，一个爱捣鼓的前端
            </div>
            <div className="flex gap-1">
              <motion.div
                layout
                key="title-middle-left"
                className="leading-[30px] sm:leading-[45px]"
              >
                在这里分享
              </motion.div>
              <div className="relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    layout
                    transition={{
                      type: 'tween',
                      duration: 0.3,
                    }}
                    className="inline-flex items-center justify-center leading-[30px] sm:leading-[45px]"
                  >
                    {textItem && <span className={textItem.className}>{textItem.text}</span>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </h1>
          <div className="text-muted-foreground text-sm">
            广东 • UTC/GMT +8
          </div>
        </motion.div>
        <motion.div
          className="relative hidden size-28 mt-3 md:block"
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <TiltedCard
            imageSrc="/images/home/avatar.webp"
            altText="LeoStar"
            captionText="LeoStar"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip
            displayOverlayContent
            overlayContent={(
              <p className="rounded-full backdrop-blur-[10px] items-center justify-center h-8 p-2.5 bg-white/70 dark:bg-white/30 md:flex hidden">
                Hello
              </p>
            )}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-tl from-purple-700 to-orange-700 opacity-0 blur-2xl md:opacity-50" />
        </motion.div>
      </div>
    </div>
  )
}

export default Hero

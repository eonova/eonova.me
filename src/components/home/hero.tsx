'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import TiltedCard from './tilted-card'

const TEXTS = [
  {
    text: '硬核实用的编程',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#1E90FF] to-[#00BFFF]',
  },
  {
    text: '自己拍的小照片',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#b5b557] to-[#ddc335]',
  },
  {
    text: '看过好看的电影',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#FF0000] to-[#FF7F50]',
  },
  {
    text: '读过有所感悟的书',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#32CD32] to-[#37e837]',
  },
  {
    text: '奇妙的代码世界',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#8A2BE2] to-[#9932CC]',
  },
  {
    text: '有趣的生活日常',
    className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#FF69B4] to-[#FF1493]',
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
    <div className="space-y-6 md:my-16">
      <div className="flex flex-col-reverse gap-8 md:flex-row md:justify-between">
        <motion.div
          className="flex flex-col gap-4 md:max-w-xl"
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
          <h1 className="font-title bg-gradient-to-b from-black via-black/90 to-black/70 to-90% bg-clip-text text-2xl font-bold leading-9 text-transparent sm:text-4xl sm:leading-[3.5rem] dark:from-white dark:via-white/90 dark:to-white/70">
            <div>
              我是 LeoStar ，一个爱捣鼓的前端
            </div>
            <div className="flex gap-2">
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
          className="relative size-20 md:size-28"
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
            imageSrc="/images/avatar.png"
            altText="LeoStar"
            captionText="LeoStar"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip
            displayOverlayContent
            overlayContent={(
              <p className="rounded-full backdrop-blur-[10px] items-center justify-center h-8 p-2 bg-white/30 sm:flex hidden">
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

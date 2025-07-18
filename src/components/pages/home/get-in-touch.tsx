'use client'

import { motion, useAnimate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import me from '@/public/images/home/call-me.jpg'

import { BlurImage } from '~/components/base/blur-image'

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

function GetInTouch() {
  const [scope, animate] = useAnimate()
  const cardsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardsRef, { once: true, margin: '-100px' })

  useEffect(() => {
    animate(
      [
        ['#pointer', { left: 200, top: 60 }, { duration: 0 }],
        ['#javascript', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 50, top: 102 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#javascript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#react-js', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 224, top: 170 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#react-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#typescript', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 88, top: 198 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#typescript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#next-js', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 200, top: 60 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#next-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    )
  }, [animate])

  return (
    <motion.div
      className="shadow-feature-card dark:shadow-feature-card-dark relative rounded-xl p-1 backdrop-blur-lg"
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={cardsRef}
      transition={{
        duration: 0.5,
      }}
    >
      <div className="flex flex-col gap-6 rounded-[11px] p-4 lg:p-6">
        <div className="flex gap-12 max-md:flex-col">
          <div className="relative size-64 max-md:mx-auto" ref={scope}>
            <BlurImage
              src={me}
              width={500}
              height={500}
              className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
              alt="Call Me"
            />
            <div
              id="next-js"
              className="absolute bottom-12 left-14 rounded-3xl border bg-gradient-to-b from-zinc-50 to-zinc-100 px-2 py-1.5 text-xs opacity-40 dark:from-zinc-800 dark:to-zinc-900"
            >
              编程
            </div>
            <div
              id="react-js"
              className="absolute top-20 left-2 rounded-3xl border bg-gradient-to-b from-zinc-50 to-zinc-100 px-2 py-1.5 text-xs opacity-40 dark:from-zinc-800 dark:to-zinc-900"
            >
              生活
            </div>
            <div
              id="typescript"
              className="absolute right-1 bottom-20 rounded-3xl border bg-gradient-to-b from-zinc-50 to-zinc-100 px-2 py-1.5 text-xs opacity-40 dark:from-zinc-800 dark:to-zinc-900"
            >
              学习
            </div>
            <div
              id="javascript"
              className="absolute top-10 right-8 rounded-3xl border bg-gradient-to-b from-zinc-50 to-zinc-100 px-2 py-1.5 text-xs opacity-40 dark:from-zinc-800 dark:to-zinc-900"
            >
              技术
            </div>

            <div id="pointer" className="absolute">
              <svg
                width="16.8"
                height="18.2"
                viewBox="0 0 12 13"
                className="fill-red-500"
                stroke="white"
                strokeWidth="1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                />
              </svg>
              <span className="relative left-4 rounded-3xl bg-red-500 px-2 py-0.5 text-xs text-white">
                Eonova
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-4">
            <p className="mb-2 bg-gradient-to-r from-black to-black/70 bg-clip-text text-3xl font-semibold text-transparent dark:from-zinc-100 dark:to-zinc-400">
              欢迎大家来找我交流
            </p>
            <p className="text-zinc-800 dark:text-zinc-300">期待ing (✧∀✧)</p>
            <div className="my-8">
              <a
                href="mailto:hi@eonova.me"
                className="bg-email-button rounded-full px-4 py-2 text-sm text-white"
              >
                hi@eonova.me
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GetInTouch

'use client'
import { Search } from 'lucide-react'
import { easeIn, easeOut, motion } from 'motion/react'
import useScrollDirection from '~/hooks/use-scroll-direction'
import GlassSurface from '../shared/glass-surface'

function MobileDock() {
  const { isVisible, isAtTop } = useScrollDirection()

  // dock 的显示逻辑：不在顶部，并且是向上滚动的时候才显示
  const shouldShow = isVisible && !isAtTop

  const mobileDockVariants = {
    initial: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: easeIn,
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: easeIn,
      },
    },
    hidden: {
      y: 100,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: easeOut,
      },
    },
  }

  return (
    <motion.div
      variants={mobileDockVariants}
      initial="initial"
      animate={shouldShow ? 'visible' : 'hidden'}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto h-[50px] w-[200px] items-center justify-between rounded-full sm:hidden"
    >
      <GlassSurface
        borderRadius={24}
        borderWidth={0.08}
        brightness={70}
        opacity={0.95}
        blur={16}
        displace={1}
        width={200}
        height={50}
      >
        <div className="w-full flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center">
            <Search className="size-8 cursor-pointer" />
          </div>
          <div className="flex-1 flex justify-center">
            <Search className="size-8" />
          </div>
        </div>
      </GlassSurface>
    </motion.div>
  )
}

export default MobileDock

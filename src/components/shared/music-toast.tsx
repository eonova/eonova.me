'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useMusicToast } from '~/hooks/use-music-toast'

export function MusicToast() {
  const { visible, songName, artist, duration, hide } = useMusicToast()

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (visible && duration > 0) {
      timer = setTimeout(() => {
        hide()
      }, duration)
    }
    return () => {
      timer && clearTimeout(timer)
    }
  }, [visible, duration, hide])

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-black/30 dark:bg-zinc-900/30 text-white px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md  text-xs border-white/10 border "
          >
            <div className="text-lg font-semibold text-center">
              {songName}
              -
              {artist}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { motion } from 'motion/react'
import { Skeleton } from '~/components/base/skeleton'

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-[#1E2939]/80 rounded-xl shadow-md overflow-hidden"
    >
      <Skeleton className="w-full h-72 sm:h-80 bg-gray-200 dark:bg-black/80 animate-pulse" />
    </motion.div>
  )
}

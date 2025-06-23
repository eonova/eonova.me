import { motion } from 'motion/react'
import { Skeleton } from '~/components/base/skeleton'

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-[#1E2939]/80"
    >
      <Skeleton className="h-72 w-full animate-pulse bg-gray-200 sm:h-80 dark:bg-black/80" />
    </motion.div>
  )
}

import { motion } from 'motion/react'
import { Skeleton } from '~/components/base/skeleton'

export function FriendSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center p-3 rounded-lg mb-3 shadow-sm"
    >
      <Skeleton className="w-full h-20 bg-gray-200 dark:bg-gray-700/20 animate-pulse" />
    </motion.div>
  )
}

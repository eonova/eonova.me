import { motion } from 'framer-motion'
import { Skeleton } from './base/skeleton'

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <Skeleton className="w-full h-64 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex justify-between">
          <Skeleton className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <Skeleton className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

import { motion } from 'motion/react'
import { Skeleton } from '~/components/base/skeleton'

export function TalkSkeleton() {
  const loadingVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={loadingVariants}
      className="mt-[50px] flex flex-col gap-2 space-y-2 sm:flex-row sm:gap-4"
    >
      <div className="flex gap-3 sm:hidden sm:w-[40px]">
        <Skeleton className="sm:size-[40px]rounded-full size-[32px]" />
        <div className="flex flex-col items-center self-start md:flex-row md:gap-2">
          <Skeleton className="h-6 w-24 self-start text-sm font-medium sm:text-lg md:self-auto" />
          <Skeleton className="h-4 w-32 text-xs opacity-80 md:-translate-y-1 md:self-end" />
        </div>
      </div>
      <Skeleton className="hidden size-[32px] rounded-full sm:block sm:size-[40px]" />
      <div className="flex max-w-full min-w-0 flex-col gap-2 pl-3 sm:gap-3 sm:pl-0">
        <div className="hidden flex-col items-center self-start sm:flex md:flex-row md:gap-2">
          <Skeleton className="h-6 w-32 self-start text-lg font-medium md:self-auto" />
          <Skeleton className="h-4 w-32 text-xs opacity-80 md:-translate-y-1 md:self-end" />
        </div>
        <div className="relative w-full min-w-0 grow sm:w-auto">
          <Skeleton className="relative inline-block h-24 w-full rounded-xl p-3" />
        </div>
      </div>
    </motion.div>
  )
}

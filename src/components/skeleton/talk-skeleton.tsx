import { motion } from 'framer-motion'
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
      className="flex flex-col sm:flex-row mt-[50px] gap-2 sm:gap-4 space-y-2"
    >
      <div className="flex sm:hidden gap-3 sm:w-[40px]">
        <Skeleton className="size-[32px] sm:size-[40px]rounded-full" />
        <div className="flex flex-col items-center self-start md:flex-row md:gap-2">
          <Skeleton className="self-start text-sm sm:text-lg font-medium md:self-auto w-24 h-6" />
          <Skeleton className="text-xs opacity-80 md:-translate-y-1 md:self-end w-32 h-4" />
        </div>
      </div>
      <Skeleton className="hidden sm:block size-[32px] sm:size-[40px] rounded-full" />
      <div className="min-w-0 max-w-full flex flex-col gap-2 sm:gap-3 pl-3 sm:pl-0">
        <div className="hidden sm:flex flex-col items-center self-start md:flex-row md:gap-2">
          <Skeleton className="self-start text-lg font-medium md:self-auto w-32 h-6" />
          <Skeleton className="text-xs opacity-80 md:-translate-y-1 md:self-end w-32 h-4" />
        </div>
        <div className="relative w-full sm:w-auto min-w-0 grow">
          <Skeleton className="relative inline-block rounded-xl p-3 w-full h-24" />
        </div>
      </div>
    </motion.div>
  )
}

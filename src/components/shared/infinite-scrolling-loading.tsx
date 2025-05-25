import { motion } from 'motion/react'

interface InfiniteScrollingLoadingProps {
  hasNextPage: boolean
  status: string
  totalItems: number
}

const InfiniteScrollingLoading: React.FC<InfiniteScrollingLoadingProps> = ({ hasNextPage, status, totalItems }) => {
  return (
    <>
      {hasNextPage
        ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400"
            >
              <svg
                className="animate-spin h-6 w-6 text-pink-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
                />
              </svg>
            </motion.div>
          )
        : (
            status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500"
              >
                {totalItems > 0 ? '🎉 已经到底啦 (≧▽≦) ～' : '⚠️ 暂无相关数据 (╯︵╰,)'}
              </motion.div>
            )
          )}
    </>
  )
}

export default InfiniteScrollingLoading

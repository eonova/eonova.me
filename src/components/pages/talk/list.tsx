'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { api } from '~/trpc/react'
import InfiniteScrollingLoading from '../../shared/infinite-scrolling-loading'
import { TalkSkeleton } from '../../skeleton/talk-skeleton'
import TalkBox from './box'

interface TalkListProps {
  pageSize?: number
}

const TalkList: React.FC<TalkListProps> = ({ pageSize = 10 }) => {
  const {
    data,
    isLoading,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.talks.getAllTalks.useInfiniteQuery(
    { limit: pageSize },
    { getNextPageParam: lastPage => lastPage.nextCursor },
  )

  const { ref, inView } = useInView({ threshold: 0.1 })

  useEffect(() => {
    if (inView && hasNextPage)
      fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  const talks = data?.pages.flatMap(page => page.items) ?? []

  // 动画配置
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.5 },
  }

  return (
    <div className="space-y-4">
      {/* 加载状态 */}
      {isLoading && Array.from({ length: 2 }).fill(0).map((_, i) => <TalkSkeleton key={`skeleton-${i}`} />)}

      {/* 错误状态 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500"
        >
          加载失败：
          {error.message}
        </motion.div>
      )}

      {/* 数据列表 */}
      <AnimatePresence>
        {talks.length > 0 && (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="w-full"
          >
            {talks.map(talk => (
              <motion.div
                key={talk.id}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 100 }}
                viewport={{ once: true, margin: '0px 0px -50px 0px' }}
              >
                <TalkBox
                  id={talk.id}
                  time={talk.createdAt}
                >
                  {talk.content}
                </TalkBox>
              </motion.div>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* 加载更多指示器 */}
      <div
        ref={ref}
        className="text-center text-sm text-gray-500"
      >
        <InfiniteScrollingLoading status={status} hasNextPage={isFetchingNextPage} totalItems={talks.length} />
      </div>
    </div>
  )
}

export default TalkList

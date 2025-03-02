'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { api } from '~/trpc/react'
import { TalkSkeleton } from '../skeleton/talk-skeleton'
import TalkBox from './box'

interface TalkListProps {
  pageSize?: number
}

const TalkList: React.FC<TalkListProps> = ({ pageSize = 10 }) => {
  const {
    data,
    isLoading,
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
      <motion.div
        ref={ref}
        className="text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isFetchingNextPage && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="inline-block"
          >
            🔄
          </motion.div>
        )}
        {!hasNextPage && talks.length > 0 && '没有更多内容了'}
        {!isLoading && talks.length === 0 && '暂时没有动态，快来发布第一条吧！'}
      </motion.div>
    </div>
  )
}

export default TalkList

'use client'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { TalkSkeleton } from '~/components/modules/skeleton/talk-skeleton'
import { useTalkStore } from '~/stores/talk'
import { useTRPC } from '~/trpc/client'
import InfiniteScrollingLoading from '../../shared/infinite-scrolling-loading'
import TalkBox from './box'
import CommentDialog from './comment-modal'

interface TalkListProps {
  pageSize?: number
}

const TalkList: React.FC<TalkListProps> = () => {
  const trpc = useTRPC()
  const { data, isLoading, status, error, fetchNextPage, hasNextPage, isFetchingNextPage }
    = useInfiniteQuery(
      trpc.talks.getAllTalks.infiniteQueryOptions(
        {},
        {
          getNextPageParam: lastPage => lastPage.nextCursor,
          placeholderData: keepPreviousData,
        },
      ),
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

  const { isOpenCommentDialog } = useTalkStore()

  return (
    <div className="space-y-4">
      {/* 加载状态 */}
      {isLoading
        && Array.from({ length: 2 })
          .fill(0)
          .map((_, i) => <TalkSkeleton key={`skeleton-${i}`} />)}

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
                <TalkBox id={talk.id} time={talk.createdAt} likes={talk.likes}>
                  {talk.content}
                </TalkBox>
              </motion.div>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* 加载更多指示器 */}
      <div ref={ref} className="text-center text-sm text-gray-500">
        <InfiniteScrollingLoading
          status={status}
          hasNextPage={isFetchingNextPage}
          totalItems={talks.length}
        />
      </div>

      <CommentDialog isVisible={isOpenCommentDialog} />
    </div>
  )
}

export default TalkList

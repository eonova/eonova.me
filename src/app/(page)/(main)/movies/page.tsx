'use client'
import type { DoubanDataResponse } from '~/types/douban'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import InfiniteScrollingLoading from '~/components/shared/infinite-scrolling-loading'
import PageTitle from '~/components/shared/page-title'
import RecreationCard from '~/components/shared/recreation-card'
import { CardSkeleton } from '~/components/skeleton/card-skeleton'
import { api } from '~/trpc/react'

// 定义模式类型
const MODES = ['wish', 'collect'] as const
type MovieMode = typeof MODES[number]

// 模式映射中文
const MODE_LABELS: Record<MovieMode, string> = {
  wish: '在看',
  collect: '看过',
}

const Movies: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 })
  const [selectedMode, setSelectedMode] = useState<MovieMode>('wish')
  const [loadedPages, setLoadedPages] = useState(1)
  const pageSize = 16

  // 数据查询
  const { data, status, isRefetching } = api.movies.getMovieData.useQuery({
    actions: ['wish', 'collect'],
    config: {
      contentConfig: {
        pagination: {
          defaultPageSize: 200,
          maxVisibleLines: 4,
        },
        type: 'movie',
        allowedActions: [],
        showQuote: false,
      },
    },
  })

  // 获取当前选项卡数据
  const currentCollection = (data as DoubanDataResponse)?.data?.collections?.find(c => c.action === selectedMode)
  const allItems = currentCollection?.items?.flat() || []
  const totalItems = allItems.length
  const displayedItems = allItems.slice(0, loadedPages * pageSize)
  const hasMore = displayedItems.length < totalItems

  // 滚动加载处理
  useEffect(() => {
    if (inView && hasMore && !isRefetching) {
      setLoadedPages(prev => prev + 1)
    }
  }, [inView, hasMore, isRefetching])

  return (
    <>
      <PageTitle
        title="观影记录"
        description="看一部电影，走一遍人生🎬"
      />
      <div className="container mx-auto">
        {/* 模式切换按钮 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-3 scrollbar-hide">
          {MODES.map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setSelectedMode(mode)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedMode === mode
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            >
              {MODE_LABELS[mode]}
              {' '}
              {(data as DoubanDataResponse)?.data?.user?.stats?.movie?.[mode] || 0}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {/* 首次加载或切换标签时的骨架屏 */}
          {(status === 'pending' || isRefetching) && (
            Array.from({ length: pageSize }).fill(0).map((_, i) => (
              <CardSkeleton key={`skeleton-${i}`} />
            ))
          )}

          {/* 正常数据展示 */}
          {status === 'success' && !isRefetching && displayedItems.map((item: any, idx: number) => (
            <RecreationCard
              key={`${item.detailUrl}-${idx}`}
              {...item}
              item={item}
              className={isRefetching ? 'opacity-75 transition-opacity' : ''}
            />
          ))}
        </div>

        {/* 滚动触发 & 加载状态 */}
        <div ref={ref} className="h-16 text-center py-4">
          <InfiniteScrollingLoading status={status} hasNextPage={hasMore} totalItems={totalItems} />
        </div>
      </div>
    </>
  )
}

export default Movies

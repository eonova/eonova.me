'use client'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { AnimeCard, AnimeCardSkeleton } from '~/components/anime-card'
import PageTitle from '~/components/page-title'
import { api } from '~/trpc/react'

// 定义模式类型
const MODES = ['watching', 'watched', 'shelving', 'wish', 'abandon'] as const
type AnimeMode = typeof MODES[number]

// 模式映射中文
const MODE_LABELS: Record<AnimeMode, string> = {
  watching: '在看',
  watched: '看过',
  shelving: '搁置',
  wish: '想看',
  abandon: '抛弃'
}

export default function BangumiPage() {
  const { ref, inView } = useInView()
  const [selectedMode, setSelectedMode] = useState<AnimeMode>('watching')
  const limit = 16

  // 数据查询
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isRefetching,
  } = api.bangumi.getAnimeData.useInfiniteQuery(
    {
      username: 'leostar',
      types: [selectedMode],
      config: {
        contentConfig: { pagination: { limit } },
        apiKey: 'NquBd4qGHcxwOIwq1Iv4lBHbH44MSL45oDXuMk1T',
      },
    },
    {
      getNextPageParam: lastPage => lastPage.data?.nextCursor,
      initialCursor: 0,
    }
  )

  // 模式切换时重置数据
  useEffect(() => {
    fetchNextPage()
  }, [selectedMode])

  // 滚动加载处理
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetching])

  // 合并所有数据项
  const allItems = data?.pages.flatMap(page => page.data?.items ?? []) || []

  return (
    <div className="container mx-auto px-4">
      <PageTitle title="追番" description="二次元是心灵的乌托邦💖" />

      {/* 模式切换按钮 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-3 scrollbar-hide">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedMode === mode
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {/* 首次加载或模式切换时的骨架屏 */}
        {(isLoading || isRefetching) &&
          Array(limit).fill(0).map((_, i) => <AnimeCardSkeleton key={`s-${i}`} />)}

        {/* 正常数据展示 */}
        {!(isLoading || isRefetching) && allItems.map((item, index) => (
          <AnimeCard
            key={`${item.detailUrl}-${index}`}
            {...item}
            className={isFetching ? 'opacity-75 transition-opacity' : ''}
          />
        ))}

        {/* 加载更多时的骨架屏 */}
        {isFetching && !isRefetching &&
          Array(limit / 2).fill(0).map((_, i) => <AnimeCardSkeleton key={`f-${i}`} />)}
      </div>

      {/* 滚动触发元素 */}
      <div ref={ref} className="h-16 text-center py-4">
        {hasNextPage ? (
          <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg
              className="animate-spin h-6 w-6 text-pink-500"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
              />
            </svg>
            <span>正在加载更多...</span>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            {allItems.length > 0 ? '🎉 已经到底啦～' : '⚠️ 暂无相关数据'}
          </div>
        )}
      </div>
    </div>
  )
}

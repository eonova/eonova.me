'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { CardSkeleton } from '~/components/modules/skeleton/card-skeleton'
import InfiniteScrollingLoading from '~/components/shared/infinite-scrolling-loading'
import PageTitle from '~/components/shared/page-title'
import RecreationCard from '~/components/shared/recreation-card'
import { useTRPC } from '~/trpc/client'

// 定义模式类型
const MODES = ['watching', 'watched', 'shelving', 'wish', 'abandon'] as const
type AnimeMode = (typeof MODES)[number]

// 模式映射中文
const MODE_LABELS: Record<AnimeMode, string> = {
  watching: '在看',
  watched: '看过',
  shelving: '搁置',
  wish: '想看',
  abandon: '抛弃',
}

function Page() {
  const trpc = useTRPC()
  const { ref, inView } = useInView()
  const [selectedMode, setSelectedMode] = useState<AnimeMode>('watching')
  const limit = 16

  // 数据查询
  const { data, status, fetchNextPage, hasNextPage, isFetching, isLoading, isRefetching }
    = useInfiniteQuery(
      trpc.bangumi.getAnimeData.infiniteQueryOptions(
        {
          types: [selectedMode],
          config: {
            contentConfig: { pagination: { limit } },
          },
        },
        {
          getNextPageParam: lastPage =>
            'data' in lastPage ? lastPage.data?.nextCursor : undefined,
          initialCursor: 0,
        },
      ),
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
  const allItems
    = data?.pages.flatMap(page => ('data' in page ? (page.data?.items ?? []) : [])) ?? []

  return (
    <div className="container mx-auto">
      <PageTitle title="追番" description="二次元是心灵的乌托邦💖" />

      {/* 模式切换按钮 */}
      <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-3">
        {MODES.map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => setSelectedMode(mode)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedMode === mode
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {/* 首次加载或模式切换时的骨架屏 */}
        {(isLoading ?? isRefetching)
          && Array.from({ length: limit })
            .fill(0)
            .map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)}

        {/* 正常数据展示 */}
        {!(isLoading ?? isRefetching)
          && allItems.map((item, index) => (
            <RecreationCard
              key={`${item.detailUrl}-${index}`}
              {...item}
              item={item}
              className={isFetching ? 'opacity-75 transition-opacity' : ''}
            />
          ))}
      </div>

      {/* 滚动触发元素 */}
      <div ref={ref} className="h-16 py-4 text-center">
        <InfiniteScrollingLoading
          status={status}
          hasNextPage={hasNextPage}
          totalItems={allItems.length}
        />
      </div>
    </div>
  )
}
export default Page

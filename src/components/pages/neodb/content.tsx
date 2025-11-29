'use client'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { CardSkeleton } from '~/components/modules/skeleton/card-skeleton'
import InfiniteScrollingLoading from '~/components/shared/infinite-scrolling-loading'
import RecreationCard from '~/components/shared/recreation-card'
import { useNeoDBShelf } from '~/hooks/queries/neodb.query'

const TYPES = ['wishlist', 'progress', 'complete'] as const
type ShelfType = (typeof TYPES)[number]

const TYPE_LABELS: Record<ShelfType, string> = {
  wishlist: '想要',
  progress: '在进行',
  complete: '已完成',
}

const CATEGORIES = ['book', 'movie', 'tv', 'music'] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<Category, string> = {
  book: '书籍',
  movie: '电影',
  tv: '剧集',
  music: '音乐',
}

function NeoDBContent() {
  const { ref, inView } = useInView()
  const [selectedType, setSelectedType] = useState<ShelfType>('complete')
  const [selectedCategory, setSelectedCategory] = useState<Category>('movie')
  const limit = 16

  const { data, status, fetchNextPage, hasNextPage, isFetching, isLoading, isRefetching, refetch } = useNeoDBShelf(
    pageParam => ({
      types: [selectedType],
      category: selectedCategory,
      page: pageParam ?? 1,
    }),
  )

  useEffect(() => {
    refetch()
  }, [selectedType, selectedCategory, refetch])

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage])

  const allItems = data?.pages.flatMap(page => page.items ?? []) ?? []

  return (
    <>
      <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto pb-2">
        {TYPES.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedType === type
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-3">
        {CATEGORIES.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === category
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {(isLoading ?? isRefetching)
          && Array.from({ length: limit })
            .fill(0)
            .map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)}

        {!(isLoading ?? isRefetching)
          && allItems.map((item, index) => (
            <RecreationCard
              key={`${item.detailUrl}-${index}`}
              item={{
                title: item.title,
                detailUrl: item.detailUrl,
                coverUrl: item.coverUrl ?? '',
                metaInfo: [CATEGORY_LABELS[item.category as Category] ?? item.category, item.brief ?? '']
                  .filter(Boolean)
                  .join(' | '),
                publishDate: item.createdTime,
                rate: item.ratingGrade?.toString() ?? item.rating?.toString(),
              }}
              className={isFetching ? 'opacity-75 transition-opacity' : ''}
            />
          ))}
      </div>

      <div ref={ref} className="h-16 py-4 text-center">
        <InfiniteScrollingLoading status={status} hasNextPage={hasNextPage} totalItems={allItems.length} />
      </div>
    </>
  )
}

export default NeoDBContent

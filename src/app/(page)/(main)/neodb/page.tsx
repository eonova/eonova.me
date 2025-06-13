'use client'
import type { ShelfType } from '~/components/pages/neodb/neodb-tabs'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import CategoriesTabs from '~/components/pages/neodb/categories-tabs'
import NeodbTabs from '~/components/pages/neodb/neodb-tabs'
import InfiniteScrollingLoading from '~/components/shared/infinite-scrolling-loading'
import PageTitle from '~/components/shared/page-title'
import RecreationCard from '~/components/shared/recreation-card'
import { useTRPC } from '~/trpc/client'

type Category = 'book' | 'movie' | 'tv' | 'music' | 'podcast'

function Page() {
  const trpc = useTRPC()

  const categories = [
    { label: '电影', value: 'movie' },
    { label: '书籍', value: 'book' },
    { label: '电视', value: 'tv' },
    { label: '音乐', value: 'music' },
    { label: '播客', value: 'podcast' },
  ]

  const { ref, inView } = useInView({ threshold: 0.1 })
  const [activeCategory, setActiveCategory] = useState(categories[0]?.value ?? '')
  const [activeType, setActiveType] = useState<ShelfType>('wishlist')
  const [loadedPages, setLoadedPages] = useState<number>(1)

  const { data, status, isRefetching } = useInfiniteQuery(
    trpc.neodb.getShelf.infiniteQueryOptions(
      {
        types: [activeType],
        config: activeCategory as Category,
        cursor: loadedPages,
      },
      {
        getNextPageParam: lastPage => 'data' in lastPage ? lastPage.data?.nextCursor : void 0,
        initialCursor: 0,
      },
    ),
  )

  const displayedItems = data?.pages.flatMap(page => page.data?.items) ?? []
  console.log('========displayedItems==========', displayedItems)
  const totalItems = data?.pages[0]?.data?.total ?? 0
  const hasMore = displayedItems.length < totalItems

  useEffect(() => {
    if (inView && hasMore && !isRefetching) {
      setLoadedPages(prev => prev + 1)
    }
  }, [inView, hasMore, isRefetching])

  console.log('========data==========', data)

  return (
    <>
      <PageTitle
        title="NeoDB"
        description="NeoDB 是一个基于 Neovim 的在线编辑器，支持实时协作编辑。"
      />
      <CategoriesTabs categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <NeodbTabs className="mt-10" activeType={activeType} setActiveType={setActiveType} />
      {status === 'success' && !isRefetching && displayedItems.map((item: any, idx: number) => (
        <RecreationCard
          key={`${item.detailUrl}-${idx}`}
          {...item}
          item={item}
          className={isRefetching ? 'opacity-75 transition-opacity' : ''}
        />
      ))}

      <div ref={ref} className="h-16 text-center py-4">
        <InfiniteScrollingLoading status={status} hasNextPage={hasMore} totalItems={totalItems} />
      </div>
    </>
  )
}

export default Page

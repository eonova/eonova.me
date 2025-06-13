'use client'
import type { DoubanDataResponse } from '~/types/douban'
import { useQuery } from '@tanstack/react-query'
import DoubanLayout from '~/components/layouts/douban-layout'
import PageTitle from '~/components/shared/page-title'
import { useTRPC } from '~/trpc/client'

function Page() {
  const trpc = useTRPC()

  const { data, status, isRefetching } = useQuery(trpc.movies.getMovieData.queryOptions({
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
  }))

  return (
    <>
      <PageTitle
        title="观影记录"
        description="看一部电影，走一遍人生🎬"
      />
      <DoubanLayout
        MODES={['wish', 'collect']}
        data={data as DoubanDataResponse}
        status={status}
        isRefetching={isRefetching}
      />
    </>
  )
}

export default Page

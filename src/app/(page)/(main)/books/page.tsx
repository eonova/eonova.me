'use client'
import type { DoubanDataResponse } from '~/types/douban'
import { useQuery } from '@tanstack/react-query'
import DoubanLayout from '~/components/layouts/douban-layout'
import PageTitle from '~/components/shared/page-title'
import { useTRPC } from '~/trpc/client'

function Page() {
  const trpc = useTRPC()

  const { data, status, isRefetching } = useQuery(
    trpc.books.getBookData.queryOptions({
      actions: ['do', 'wish', 'collect'],
      config: {
        contentConfig: {
          pagination: {
            defaultPageSize: 16,
            maxVisibleLines: 4,
          },
          type: 'book',
          allowedActions: [],
          showQuote: false,
        },
      },
    }),
  )

  return (
    <>
      <PageTitle title="书单" description="读万卷书，行万里路📚" />
      <DoubanLayout
        MODES={['do', 'wish', 'collect']}
        data={data as DoubanDataResponse}
        status={status}
        isRefetching={isRefetching}
        isFlat
      />
    </>
  )
}

export default Page

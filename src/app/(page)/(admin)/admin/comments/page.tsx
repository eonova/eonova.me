'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DataTableSkeleton } from '~/components/modules/data-table/data-table-skeleton'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import CommentsTable from '~/components/pages/admin/comments/comments-table'
import { useAdminCommentsParams } from '~/hooks/use-admin-comments-params'
import { useTRPC } from '~/trpc/client'

function Page() {
  const [params] = useAdminCommentsParams()
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.comments.getComments.queryOptions(
      { ...params },
      {
        placeholderData: keepPreviousData,
      },
    ),
  )

  const isInitialLoading = isLoading && !data
  return (
    <div className="space-y-6">
      <AdminPageHeader title="评论" description="管理用户的评论" />
      {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} filterCount={3} />}
      {isError ? <div>无法获取评论数据。请刷新页面。</div> : null}
      {!isInitialLoading && data && (
        <CommentsTable
          data={data.comments}
          pageCount={data.pageCount}
          typeCounts={data.typeCounts}
        />
      )}
    </div>
  )
}

export default Page

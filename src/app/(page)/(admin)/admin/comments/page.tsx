'use client'

import AdminPageHeader from '~/components/admin/admin-page-header'
import CommentsTable from '~/components/admin/comments/comments-table'
import { DataTableSkeleton } from '~/components/base/data-table'
import { api } from '~/trpc/react'

function Page() {
  const { status, data } = api.comments.getComments.useQuery()

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="评论"
        description="管理用户的评论"
      />
      {isLoading ? <DataTableSkeleton columnCount={3} searchableColumnsCount={2} /> : null}
      {isError ? <div>无法获取评论数据。请刷新页面。</div> : null}
      {isSuccess ? <CommentsTable data={data.comments} /> : null}
    </div>
  )
}

export default Page

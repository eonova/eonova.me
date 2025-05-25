'use client'

import { DataTableSkeleton } from '~/components/base/data-table'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import UsersTable from '~/components/pages/admin/users/users-table'
import { api } from '~/trpc/react'

function Page() {
  const { status, data } = api.users.getUsers.useQuery()

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="用户"
        description="我的个人网站和博客，分享我对各种主题的想法，包括教学、笔记和个人经验。"
      />
      {isLoading
        ? (
            <DataTableSkeleton columnCount={3} searchableColumnsCount={1} filterableColumnCount={1} />
          )
        : null}
      {isError ? <div>无法获取用户数据。请刷新页面。</div> : null}
      {isSuccess ? <UsersTable data={data.users} /> : null}
    </div>
  )
}

export default Page

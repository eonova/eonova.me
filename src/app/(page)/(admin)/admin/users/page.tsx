'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DataTableSkeleton } from '~/components/modules/data-table/data-table-skeleton'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import UsersTable from '~/components/pages/admin/users/users-table'
import { useAdminUsersParams } from '~/hooks/use-admin-users-params'
import { useTRPC } from '~/trpc/client'

function Page() {
  const [params] = useAdminUsersParams()
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.users.getUsers.queryOptions(
      { ...params },
      {
        placeholderData: keepPreviousData,
      },
    ),
  )

  const isInitialLoading = isLoading && !data
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="用户"
        description="我的个人网站和博客，分享我对各种主题的想法，包括教学、笔记和个人经验。"
      />
      {isInitialLoading && <DataTableSkeleton columnCount={4} rowCount={10} filterCount={3} />}
      {isError ? <div>无法获取用户数据。请刷新页面。</div> : null}
      {!isInitialLoading && data && (
        <UsersTable data={data.users} pageCount={data.pageCount} roleCounts={data.roleCounts} />
      )}
    </div>
  )
}

export default Page

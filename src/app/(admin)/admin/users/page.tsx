'use client'

import AdminPageHeader from '~/components/admin/admin-page-header'
import UsersTable from '~/components/admin/users-table'
import { DataTableSkeleton } from '~/components/base/data-table'
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
        description="我的个人网站和博客，分享我对各种主题的想法，包括教学、笔记和个人经验。作为一名来自香港的全端工程师，我在 2020 年 12 月开始把学习网页开发当成一种兴趣。我使用 Next.js 建立网站，GitHub 用作源代码托管，Vercel 用作部署。探索我的网站，了解更多关于我的旅程，并发现一些启发我的网页开发资源。"
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

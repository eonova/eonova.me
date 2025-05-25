'use client'

import { useState } from 'react'
import AdminPageHeader from '~/components/admin/admin-page-header'
import AddFriendDialog from '~/components/admin/friends/add-friend-dialog'
import FriendsTable from '~/components/admin/friends/friends-table'
import { DataTableSkeleton } from '~/components/base/data-table'
import { api } from '~/trpc/react'

function Page() {
  const [open, setOpen] = useState(false)
  const { status, data } = api.friend.getAllFriends.useQuery()

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="友链管理"
        description="管理所有友链链接"
      />

      {isLoading
        ? (
            <DataTableSkeleton columnCount={4} searchableColumnsCount={2} />
          )
        : null}

      {isError
        ? (
            <div className="text-red-500">无法获取友链数据，请刷新页面</div>
          )
        : null}

      {isSuccess && (
        <>
          <AddFriendDialog open={open} onClose={() => setOpen(false)} />
          <FriendsTable data={(data?.items || []).map(friend => ({
            id: friend.id,
            name: friend.name,
            avatar: friend.avatar ?? '',
            url: friend.url,
          }))}
          />
        </>
      )}
    </div>
  )
}

export default Page

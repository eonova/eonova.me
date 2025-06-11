'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTableSkeleton } from '~/components/modules/data-table/data-table-skeleton'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import AddFriendDialog from '~/components/pages/admin/friends/friend-add-dialog'
import FriendsTable from '~/components/pages/admin/friends/friends-table'
import { useTRPC } from '~/trpc/client'

function Page() {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.friend.getAllFriends.queryOptions(),
  )

  const isInitialLoading = isLoading && !data

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="友链管理"
        description="管理所有友链链接"
      />

      {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} filterCount={3} />}
      {isError
        ? (
            <div className="text-red-500">无法获取友链数据，请刷新页面</div>
          )
        : null}

      {!isInitialLoading && data && (
        <>
          <AddFriendDialog open={open} onClose={() => setOpen(false)} />
          <FriendsTable
            data={(data.items || []).map((friend: { id: string, name: string, avatar: string | null, url: string, description: string | null }) => ({
              id: friend.id,
              name: friend.name,
              avatar: friend.avatar ?? '',
              url: friend.url,
              description: friend.description ?? '',
            }))}
          />
        </>
      )}
    </div>
  )
}

export default Page

'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { ListAllFriendsOutput } from '~/orpc/routers'

import { Button } from '~/components/base/button'
import { useFriendDialogsStore } from '~/stores/friend'

export type Friend = ListAllFriendsOutput['friends'][number]

function FriendActions({ row }: { row: Friend }) {
  const { setUpdateDialogs, setCurrentFriend, setDeleteDialogs } = useFriendDialogsStore()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setCurrentFriend(row)
          setUpdateDialogs(true)
        }}
      >
        编辑
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentFriend(row)
          setDeleteDialogs(true)
        }}
      >
        删除
      </Button>
    </div>
  )
}

export const columns: ColumnDef<Friend>[] = [
  {
    accessorKey: 'avatar',
    header: '头像',
    cell: ({ row }) => (
      <img
        src={row.original.avatar || ''}
        alt={row.original.name}
        className="h-8 w-8 rounded-full object-cover"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: '名称',
  },
  {
    accessorKey: 'url',
    header: '链接',
    cell: ({ row }) => (
      <a href={row.original.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline max-w-[200px] truncate block">
        {row.original.url}
      </a>
    ),
  },
  {
    accessorKey: 'description',
    header: '描述',
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => <FriendActions row={row.original} />,
  },
]

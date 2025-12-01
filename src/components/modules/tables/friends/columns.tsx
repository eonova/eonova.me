'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { ListAllFriendsOutput } from '~/orpc/routers'

import { toast } from 'sonner'
import { Button } from '~/components/base/button'
import { useUpdateFriend } from '~/hooks/queries/friend.query'
import { useFriendDialogsStore } from '~/stores/friend'

export type Friend = ListAllFriendsOutput['friends'][number]

function FriendActions({ row }: { row: Friend }) {
  const { setUpdateDialogs, setCurrentFriend, setDeleteDialogs } = useFriendDialogsStore()
  const { mutate: updateFriend } = useUpdateFriend(() => {
    toast.success('更新成功')
  })

  return (
    <div className="flex items-center gap-2">
      {!row.active && (
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
          onClick={() => {
            updateFriend({
              id: row.id,
              name: row.name,
              url: row.url,
              avatar: row.avatar ?? undefined,
              description: row.description ?? undefined,
              active: true,
            })
          }}
        >
          通过
        </Button>
      )}
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
    accessorKey: 'active',
    header: '状态',
    cell: ({ row }) => (
      <span className={row.original.active ? 'text-green-600' : 'text-yellow-600'}>
        {row.original.active ? '已审核' : '待审核'}
      </span>
    ),
  },
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

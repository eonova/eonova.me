'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/base/data-table'
import { useFriendDialogsStore } from '~/stores/friend'
import DeleteFriendDialog from './friend-delete-dialog'
import UpdateFriendDialog from './friend-update-dialog'

// Define the expected data shape for getAllFriends
interface GetAllFriendsData {
  items: Array<{
    id: string
    name: string
    avatar: string
    url: string
  }>
}

// Use the explicit type for Friend
type Friend = GetAllFriendsData['items'][number]

interface FriendsTableProps {
  data: Friend[]
}

function FriendsTable(props: FriendsTableProps) {
  const { data } = props
  const friendDialogStore = useFriendDialogsStore()
  const [currentRowData, setCurrentRowData] = useState<Friend>()

  const columns: Array<ColumnDef<Friend>> = [
    {
      accessorKey: 'avatar',
      header: ({ column }) => <DataTableColumnHeader column={column} title="头像" />,
      cell: ({ row }) => (
        <img
          src={row.original.avatar}
          alt={row.original.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="名称" />,
    },
    {
      accessorKey: 'url',
      header: ({ column }) => <DataTableColumnHeader column={column} title="链接" />,
      cell: ({ row }) => <a href={row.original.url} target="_blank" className="text-blue-600">{row.original.url}</a>,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="描述" />,
    },
    {
      accessorKey: 'operations',
      header: ({ column }) => <DataTableColumnHeader column={column} title="操作" />,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setCurrentRowData(row.original)
              friendDialogStore.setUpdateDialogs(true)
            }}
          >
            编辑
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setCurrentRowData(row.original)
              friendDialogStore.setDeleteDialogs(true)
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      {currentRowData && (
        <>
          <DeleteFriendDialog {...currentRowData} />
          <UpdateFriendDialog {...currentRowData} />
        </>
      )}
    </>
  )
}

export default FriendsTable

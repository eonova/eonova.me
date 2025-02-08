'use client'

import type { ColumnDef, SortingState } from '@tanstack/react-table'

import type { DataTableFilterField } from '~/components/base'
import type { GetCommentsOutput } from '~/trpc/routers/comments'
import {

  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,

  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '../base/data-table'

type Comment = GetCommentsOutput['comments'][number]

interface CommentsTableProps {
  data: Comment[]
}

function CommentsTable(props: CommentsTableProps) {
  const { data } = props
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }])

  const columns: Array<ColumnDef<Comment>> = [
    {
      accessorKey: 'userId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="用户 ID" />
      ),
    },
    {
      accessorKey: 'body',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="内容" />
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="类型" />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="创建时间" />
      ),
      cell: ({ row }) => row.original.createdAt.toLocaleString(),
    },
  ]

  const filterFields: Array<DataTableFilterField<Comment>> = [
    {
      id: 'userId',
      label: '用户 ID',
      placeholder: '过滤用户 ID...',
    },
    {
      id: 'body',
      label: '内容',
      placeholder: '过滤内容...',
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}

export default CommentsTable

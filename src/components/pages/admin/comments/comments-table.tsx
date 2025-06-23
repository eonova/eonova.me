'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { GetCommentsOutput } from '~/trpc/routers/comments'
import {
  CalendarIcon,
  CircleDashedIcon,
  MessageSquareIcon,
  MessageSquareMoreIcon,
} from 'lucide-react'

import { Checkbox } from '~/components/base/checkbox'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableSortList,
  DataTableToolbar,
  formatDate,
  useDataTable,
} from '~/components/modules/data-table'
import { COMMENT_TYPES } from '~/config/constants'

type Comment = GetCommentsOutput['comments'][number]

interface CommentsTableProps {
  data: Comment[]
  pageCount: number
  typeCounts: Record<string, number>
}

function getTypeIcon(type: (typeof COMMENT_TYPES)[number]) {
  const icons = {
    comment: MessageSquareIcon,
    reply: MessageSquareMoreIcon,
  }

  return icons[type]
}

function CommentsTable(props: CommentsTableProps) {
  const { data, pageCount, typeCounts } = props

  const columns: Array<ColumnDef<Comment>> = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
            || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: 'userId',
      accessorKey: 'userId',
      header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
      meta: {
        label: 'User ID',
      },
    },
    {
      id: 'body',
      accessorKey: 'body',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Body" />,
      meta: {
        label: 'Body',
        placeholder: 'Search body...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'parentId',
      accessorKey: 'parentId',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        return row.original.parentId ? 'reply' : 'comment'
      },
      meta: {
        label: 'Type',
        variant: 'multiSelect',
        options: COMMENT_TYPES.map(type => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: type,
          count: typeCounts[type],
          icon: getTypeIcon(type),
        })),
        icon: CircleDashedIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) =>
        formatDate(row.original.createdAt, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      meta: {
        label: 'Created At',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>
    </DataTable>
  )
}

export default CommentsTable

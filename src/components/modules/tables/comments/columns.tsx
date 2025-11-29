import type { ColumnDef } from '@tanstack/react-table'
import type { ListAllCommentsOutput } from '~/orpc/routers'

import FormattedDateCell from '../formatted-date-cell'

export type Comment = ListAllCommentsOutput['comments'][number]

export const columns: Array<ColumnDef<Comment>> = [
  {
    accessorKey: 'userId',
    header: 'User ID',
  },
  {
    accessorKey: 'body',
    header: 'Body',
  },
  {
    accessorKey: 'parentId',
    header: 'Parent ID',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return <FormattedDateCell date={row.original.createdAt} />
    },
  },
]

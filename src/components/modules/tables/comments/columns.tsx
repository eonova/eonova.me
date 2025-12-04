import type { ColumnDef } from '@tanstack/react-table'
import type { ListAllCommentsOutput } from '~/orpc/routers'

import { Button } from '~/components/base/button'
import { useCommentDialogs } from '~/hooks/use-comment-dialogs'
import FormattedDateCell from '../formatted-date-cell'

export type Comment = ListAllCommentsOutput['comments'][number]

function CommentActions({ row }: { row: Comment }) {
  const { setCurrentComment, setDeleteDialogs } = useCommentDialogs()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentComment(row)
          setDeleteDialogs(true)
        }}
      >
        删除
      </Button>
    </div>
  )
}

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
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => <CommentActions row={row.original} />,
  },
]

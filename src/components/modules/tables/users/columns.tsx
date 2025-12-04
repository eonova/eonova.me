import type { ColumnDef } from '@tanstack/react-table'
import type { ListAllUsersOutput } from '~/orpc/routers'

import { Button } from '~/components/base/button'
import { useUserDialogs } from '~/hooks/use-user-dialogs'
import FormattedDateCell from '../formatted-date-cell'

export type User = ListAllUsersOutput['users'][number]

function UserActions({ row }: { row: User }) {
  const { setCurrentUser, setUpdateDialogs, setDeleteDialogs } = useUserDialogs()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setCurrentUser(row)
          setUpdateDialogs(true)
        }}
      >
        编辑
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentUser(row)
          setDeleteDialogs(true)
        }}
      >
        删除
      </Button>
    </div>
  )
}

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
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
    cell: ({ row }) => <UserActions row={row.original} />,
  },
]

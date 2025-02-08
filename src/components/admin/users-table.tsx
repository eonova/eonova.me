'use client'

import type { ColumnDef } from '@tanstack/react-table'

import type { DataTableFilterField } from '@leostar/ui'
import type { GetUsersOutput } from '~/trpc/routers/users'
import {

  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { UserCogIcon, UserIcon } from 'lucide-react'
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '../base/data-table'

type User = GetUsersOutput['users'][number]

interface UsersTableProps {
  data: User[]
}

const roles = [
  {
    value: 'user',
    label: 'User',
    icon: UserIcon,
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: UserCogIcon,
  },
]

function UsersTable(props: UsersTableProps) {
  const { data } = props

  const columns: Array<ColumnDef<User>> = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="名称" />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="电子邮件" />
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="角色" />
      ),
    },
  ]

  const filterFields: Array<DataTableFilterField<User>> = [
    {
      id: 'name',
      label: '名称',
      placeholder: '过滤名称...',
    },
    {
      id: 'role',
      label: '角色',
      options: roles,
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
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}

export default UsersTable

'use client'

import type { ColumnDef } from '@tanstack/react-table'

import type { GetUsersOutput } from '~/trpc/routers/album'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/modules/data-table'
import { useAlbumDialogsStore } from '~/stores/album'
import DeleteAlbumDialog from './album-delete-dialog'
import UpdateAlbumDialog from './album-update-dialog'

type Image = GetUsersOutput['images'][number]

interface AlbumTableProps {
  data: Image[]
}

function AlbumTable(props: AlbumTableProps) {
  const albumDialogStore = useAlbumDialogsStore()
  const { data } = props
  const columns: Array<ColumnDef<Image>> = [
    {
      accessorKey: 'imagePreView',
      header: ({ column }) => <DataTableColumnHeader column={column} title="图片地址" />,
      cell: ({ row }) => {
        const image = row.original // 获取当前行的数据
        return (
          <div className="h-20 w-24">
            <Image
              src={image.imageUrl} // 假设 imageUrl 是图片的地址
              alt="Image preview"
              width={100}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'imageUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title="图片地址" />,
      cell: ({ row }) => {
        const rowData = row.original // 获取当前行的数据
        return (
          <p className="w-50 truncate" title={rowData.imageUrl}>
            {rowData.imageUrl}
          </p>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="描述" />,
    },
    {
      accessorKey: 'WidthHeight',
      header: ({ column }) => <DataTableColumnHeader column={column} title="描述" />,
      cell: ({ row }) => {
        const rowData = row.original // 获取当前行的数据
        return (
          <p className="w-50 truncate" title={`${rowData.width}*${rowData.height}`}>
            {`${rowData.width}*${rowData.height}`}
          </p>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="创建时间" />,
    },
    {
      accessorKey: 'update',
      header: ({ column }) => <DataTableColumnHeader column={column} title="更新" />,
      cell: ({ row }) => {
        const rowData = row.original // 获取当前行的数据
        return (
          <Button
            variant="secondary"
            type="button"
            aria-details="更新图片"
            onClick={() => openUpdateDialog(rowData)}
          >
            更新
          </Button>
        )
      },
    },
    {
      accessorKey: 'delete',
      header: ({ column }) => <DataTableColumnHeader column={column} title="删除" />,
      cell: ({ row }) => {
        const rowData = row.original // 获取当前行的数据
        return (
          <Button
            variant="destructive"
            type="button"
            aria-details="删除图片"
            onClick={() => openDeleteDialog(rowData)}
          >
            删除
          </Button>
        )
      },
    },
  ]
  const [currentRowData, setCurrentRowData] = useState<Image>()

  function openUpdateDialog(rowData: Image) {
    setCurrentRowData(rowData)
    albumDialogStore.setUpdateDialogs(true)
  }
  function openDeleteDialog(rowData: Image) {
    setCurrentRowData(rowData)
    albumDialogStore.setDeleteDialogs(true)
  }

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
          <DeleteAlbumDialog {...currentRowData} />
          <UpdateAlbumDialog {...currentRowData} />
        </>
      )}
    </>
  )
}

export default AlbumTable

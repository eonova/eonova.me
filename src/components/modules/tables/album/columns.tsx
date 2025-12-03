'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { ListAllAlbumOutput } from '~/orpc/routers'

import Image from 'next/image'
import { Button } from '~/components/base/button'
import FormattedDateCell from '~/components/modules/tables/formatted-date-cell'
import { useAlbumDialogs } from '~/hooks/use-album-dialogs'

export type AlbumImage = ListAllAlbumOutput['album'][number]

function AlbumActions({ row }: { row: AlbumImage }) {
  const { setUpdateDialogs, setCurrentImage, setDeleteDialogs } = useAlbumDialogs()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setCurrentImage(row)
          setUpdateDialogs(true)
        }}
      >
        更新
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setCurrentImage(row)
          setDeleteDialogs(true)
        }}
      >
        删除
      </Button>
    </div>
  )
}

export const columns: ColumnDef<AlbumImage>[] = [
  {
    accessorKey: 'imageUrl',
    header: '预览',
    cell: ({ row }) => {
      const image = row.original
      return (
        <div className="h-20 w-24 relative">
          <Image
            unoptimized
            src={image.imageUrl}
            alt="Preview"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'url', // display url text
    header: 'URL',
    cell: ({ row }) => <div className="max-w-[200px] truncate" title={row.original.imageUrl}>{row.original.imageUrl}</div>,
  },
  {
    accessorKey: 'description',
    header: '描述',
  },
  {
    id: 'dimensions',
    header: '尺寸',
    cell: ({ row }) => {
      const { width, height } = row.original
      if (!width || !height)
        return '-'
      return `${width} x ${height}`
    },
  },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    cell: ({ row }) => <FormattedDateCell date={row.original.createdAt} />,
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => <AlbumActions row={row.original} />,
  },
]

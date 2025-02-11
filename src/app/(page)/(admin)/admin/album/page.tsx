'use client'

import AdminPageHeader from '~/components/admin/admin-page-header'
import AddAlbumDialog from '~/components/admin/album-add-dialog'
import AlbumTable from '~/components/admin/album-table'
import { DataTableSkeleton } from '~/components/base/data-table'
import { api } from '~/trpc/react'

function Page() {
  const { status, data } = api.album.getAllImages.useQuery()

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="相册管理"
        description="分享日常生活"
      />
      {isLoading
        ? (
          <DataTableSkeleton columnCount={3} searchableColumnsCount={1} filterableColumnCount={1} />
        )
        : null}
      {isError ? <div>无法获取用户数据。请刷新页面。</div> : null}
      {isSuccess && (
        <>
          <AddAlbumDialog />
          <AlbumTable data={data.images} />
        </>
      )}
    </div>
  )
}

export default Page

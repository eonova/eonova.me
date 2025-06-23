'use client'

import { useQuery } from '@tanstack/react-query'
import { DataTableSkeleton } from '~/components/modules/data-table/data-table-skeleton'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import AddAlbumDialog from '~/components/pages/admin/album/album-add-dialog'
import AlbumTable from '~/components/pages/admin/album/album-table'
import { useTRPC } from '~/trpc/client'

function Page() {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(trpc.album.getAllImages.queryOptions())

  const isInitialLoading = isLoading && !data

  return (
    <div className="space-y-6">
      <AdminPageHeader title="相册管理" description="分享日常生活" />
      {isLoading ? <DataTableSkeleton columnCount={3} rowCount={10} filterCount={1} /> : null}
      {isError ? <div>无法获取用户数据。请刷新页面。</div> : null}
      {!isInitialLoading && data && (
        <>
          <AddAlbumDialog />
          <AlbumTable data={data.images} />
        </>
      )}
    </div>
  )
}

export default Page

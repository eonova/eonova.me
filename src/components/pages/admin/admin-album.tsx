'use client'

import AlbumTable from '~/components/modules/tables/album'
import { useAdminAlbum } from '~/hooks/queries/admin.query'
import { AlbumDialogsProvider } from '~/hooks/use-album-dialogs'
import AddAlbumDialog from './album/album-add-dialog'
import DeleteAlbumDialog from './album/album-delete-dialog'
import UpdateAlbumDialog from './album/album-update-dialog'

function AdminAlbum() {
  const { isSuccess, isLoading, isError, data } = useAdminAlbum()

  return (
    <AlbumDialogsProvider>
      <div className="flex justify-end mb-4">
        <AddAlbumDialog />
      </div>
      {isSuccess && <AlbumTable data={data.album} />}
      {isLoading && 'Loading...'}
      {isError && <div>获取相册数据失败</div>}
      <UpdateAlbumDialog />
      <DeleteAlbumDialog />
    </AlbumDialogsProvider>
  )
}

export default AdminAlbum

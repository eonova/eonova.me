import AdminAlbum from '~/components/pages/admin/admin-album'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="相册" description="管理相册图片" />
      <AdminAlbum />
    </div>
  )
}

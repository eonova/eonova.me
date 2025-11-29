import AdminFriends from '~/components/pages/admin/admin-friends'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="友链管理" description="管理所有友链链接" />
      <AdminFriends />
    </div>
  )
}

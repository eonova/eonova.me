import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import AdminUsers from '~/components/pages/admin/admin-users'

async function Page() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="用户" description="管理所有用户" />
      <AdminUsers />
    </div>
  )
}

export default Page

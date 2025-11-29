import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import AdminTalks from '~/components/pages/admin/admin-talks'

function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-6">
      <AdminPageHeader title="说说" description="我的碎碎念" />
      <AdminTalks />
    </div>
  )
}

export default Page

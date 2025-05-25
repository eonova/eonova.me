import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import TalkAdmin from '~/components/pages/admin/talk/talk-admin'

function Page() {
  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <AdminPageHeader
        title="说说"
        description="我的碎碎念"
      />
      <TalkAdmin />
    </div>
  )
}

export default Page

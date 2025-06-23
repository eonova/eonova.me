import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import TalkAdmin from '~/components/pages/admin/talk/talk-admin'

function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-6">
      <AdminPageHeader title="说说" description="我的碎碎念" />
      <TalkAdmin />
    </div>
  )
}

export default Page

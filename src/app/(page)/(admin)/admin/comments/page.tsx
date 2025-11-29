import AdminComments from '~/components/pages/admin/admin-comments'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'

async function Page() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="评论" description="管理所有评论" />
      <AdminComments />
    </div>
  )
}

export default Page

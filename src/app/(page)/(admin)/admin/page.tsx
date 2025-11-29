import AdminDashboard from '~/components/pages/admin/admin-dashboard'

function Page() {
  return (
    <div className="space-y-6 flex flex-col w-full h-full">
      <h1 className="text-2xl font-bold">Blog 管理面板</h1>
      <AdminDashboard />
    </div>
  )
}

export default Page

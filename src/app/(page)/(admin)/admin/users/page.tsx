'use client'

import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import AdminUsers from '~/components/pages/admin/admin-users'
import { UserDialogsProvider } from '~/hooks/use-user-dialogs'

function Page() {
  return (
    <UserDialogsProvider>
      <div className="space-y-6">
        <AdminPageHeader title="用户" description="管理所有用户" />
        <AdminUsers />
      </div>
    </UserDialogsProvider>
  )
}

export default Page

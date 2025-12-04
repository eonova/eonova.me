'use client'

import AdminComments from '~/components/pages/admin/admin-comments'
import AdminPageHeader from '~/components/pages/admin/admin-page-header'
import { CommentDialogsProvider } from '~/hooks/use-comment-dialogs'

function Page() {
  return (
    <CommentDialogsProvider>
      <div className="space-y-6">
        <AdminPageHeader title="评论" description="管理所有评论" />
        <AdminComments />
      </div>
    </CommentDialogsProvider>
  )
}

export default Page

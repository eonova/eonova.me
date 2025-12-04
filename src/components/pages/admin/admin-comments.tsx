'use client'

import CommentsTable from '~/components/modules/tables/comments'

import { useAdminComments } from '~/hooks/queries/admin.query'
import DeleteCommentDialog from './comments/comment-delete-dialog'

function AdminComments() {
  const { isSuccess, isLoading, isError, data } = useAdminComments()
  return (
    <>
      {isSuccess && <CommentsTable comments={data.comments} />}
      {isLoading && 'Loading...'}
      {isError && <div>获取评论数据失败</div>}
      <DeleteCommentDialog />
    </>
  )
}

export default AdminComments

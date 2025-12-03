'use client'

import FriendsTable from '~/components/modules/tables/friends'
import { useAdminFriends } from '~/hooks/queries/admin.query'
import { FriendDialogsProvider } from '~/hooks/use-friend-dialogs'
import AddFriendDialog from './friends/friend-add-dialog'
import DeleteFriendDialog from './friends/friend-delete-dialog'
import UpdateFriendDialog from './friends/friend-update-dialog'

function AdminFriends() {
  const { isSuccess, isLoading, isError, data } = useAdminFriends()

  return (
    <FriendDialogsProvider>
      <div className="flex justify-end mb-4">
        <AddFriendDialog />
      </div>
      {isSuccess && <FriendsTable data={data.friends} />}
      {isLoading && 'Loading...'}
      {isError && <div>获取友链数据失败</div>}
      <UpdateFriendDialog />
      <DeleteFriendDialog />
    </FriendDialogsProvider>
  )
}

export default AdminFriends

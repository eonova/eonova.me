'use client'

import UsersTable from '~/components/modules/tables/users'

import { useAdminUsers } from '~/hooks/queries/admin.query'
import DeleteUserDialog from './users/user-delete-dialog'
import UpdateUserDialog from './users/user-update-dialog'

function AdminUsers() {
  const { isSuccess, isLoading, isError, data } = useAdminUsers()

  return (
    <>
      {isSuccess && <UsersTable users={data.users} />}
      {isLoading && 'Loading...'}
      {isError && <div>获取用户数据失败</div>}
      <UpdateUserDialog />
      <DeleteUserDialog />
    </>
  )
}

export default AdminUsers

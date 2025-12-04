'use client'

import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/base/dialog'
import { useDeleteUser } from '~/hooks/queries/admin.query'
import { useUserDialogs } from '~/hooks/use-user-dialogs'

export default function DeleteUserDialog() {
  const { deleteDialog, setDeleteDialogs, currentUser } = useUserDialogs()

  const { mutate, isPending } = useDeleteUser(() => {
    setDeleteDialogs(false)
  })

  function handleDelete() {
    if (!currentUser)
      return
    mutate({
      id: currentUser.id,
    })
  }

  return (
    <Dialog open={deleteDialog} onOpenChange={setDeleteDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这个用户吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogs(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? '删除中...' : '确认删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

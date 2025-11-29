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
import { useDeleteFriend } from '~/hooks/queries/friend.query'
import { useFriendDialogsStore } from '~/stores/friend'

export default function DeleteFriendDialog() {
  const { deleteDialog, setDeleteDialogs, currentFriend } = useFriendDialogsStore()

  const { mutate, isPending } = useDeleteFriend(() => {
    setDeleteDialogs(false)
  })

  function handleDelete() {
    if (!currentFriend)
      return
    mutate({
      id: currentFriend.id,
    })
  }

  return (
    <Dialog open={deleteDialog} onOpenChange={setDeleteDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这个友链吗？此操作无法撤销。
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

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
import { useDeleteAdminComment } from '~/hooks/queries/admin.query'
import { useCommentDialogs } from '~/hooks/use-comment-dialogs'

export default function DeleteCommentDialog() {
  const { deleteDialog, setDeleteDialogs, currentComment } = useCommentDialogs()

  const { mutate, isPending } = useDeleteAdminComment(() => {
    setDeleteDialogs(false)
  })

  function handleDelete() {
    if (!currentComment)
      return
    mutate({
      id: currentComment.id,
    })
  }

  return (
    <Dialog open={deleteDialog} onOpenChange={setDeleteDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这条评论吗？此操作无法撤销。
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

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
import { useDeleteAlbumImage } from '~/hooks/queries/album.query'
import { useAlbumDialogs } from '~/hooks/use-album-dialogs'

export default function DeleteAlbumDialog() {
  const { deleteDialog, setDeleteDialogs, currentImage } = useAlbumDialogs()

  const { mutate, isPending } = useDeleteAlbumImage(() => {
    setDeleteDialogs(false)
  })

  function handleDelete() {
    if (!currentImage)
      return
    mutate({
      id: currentImage.id,
    })
  }

  return (
    <Dialog open={deleteDialog} onOpenChange={setDeleteDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这张图片吗？此操作无法撤销。
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

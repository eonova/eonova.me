import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { Label } from '~/components/base/label'
import { toast } from '~/components/base/toaster'
import { useAlbumDialogsStore } from '~/stores/album'
import { useTRPC } from '~/trpc/client'

interface UpdateAlbumDialogProps {
  id: string
  imageUrl: string | null
  description: string | null
  height: number | null
  width: number | null
}

const UpdateAlbumDialog: React.FC<UpdateAlbumDialogProps> = ({
  id,
  imageUrl,
  description,
  height,
  width,
}) => {
  const [updateImageUrl, setUpdateImageUrl] = useState<string>(imageUrl ?? '')
  const [updateDescription, setUpdateDescription] = useState<string>(description ?? '')
  const [updateHeight, setUpdateHeight] = useState<number>(height ?? 200)
  const [updateWidth, setUpdateWidth] = useState<number>(width ?? 300)
  const albumDialogStore = useAlbumDialogsStore()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const addImageMutate = useMutation(trpc.album.updateImage.mutationOptions({
    onSuccess: async () => {
      albumDialogStore.setUpdateDialogs(false)
      toast.success('图片更新成功')
      queryClient.invalidateQueries({
        queryKey: trpc.album.getAllImages.queryKey(),
      })
    },
    onError: error => toast.error(error.message),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.album.getAllImages.queryKey(),
      })
    },
  }),
  )

  function updateImage() {
    addImageMutate.mutate({
      id,
      imageUrl: updateImageUrl,
      description: updateDescription,
      height: height ?? 200,
      width: width ?? 300,
    })
  }

  return (
    <Dialog
      open={albumDialogStore.updateDialog}
      onOpenChange={(v) => {
        albumDialogStore.setUpdateDialogs(v)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              图片地址
            </Label>
            <Input id="imageUrl" value={updateImageUrl} onChange={e => setUpdateImageUrl(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              图片描述
            </Label>
            <Input id="username" value={updateDescription} onChange={e => setUpdateDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              宽度
            </Label>
            <Input id="width" value={updateWidth} onChange={e => setUpdateWidth(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              高度
            </Label>
            <Input id="height" value={updateHeight} onChange={e => setUpdateHeight(Number(e.target.value))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={updateImage}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateAlbumDialog

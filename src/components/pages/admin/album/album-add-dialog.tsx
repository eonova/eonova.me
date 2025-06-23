'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { Label } from '~/components/base/label'
import { toast } from '~/components/base/toaster'
import { useAlbumDialogsStore } from '~/stores/album'
import { useTRPC } from '~/trpc/client'
import FileUpload from '../../album/file-upload'

const AddAlbumDialog: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [height, setHeight] = useState<number>(200)
  const [width, setWidth] = useState<number>(300)
  const albumDialogStore = useAlbumDialogsStore()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const addImageMutate = useMutation(
    trpc.album.addImage.mutationOptions({
      onSuccess: async () => {
        albumDialogStore.setAddDialogs(false)
        toast.success('图片上传成功')
      },
      onError: error => toast.error(error.message),
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.album.getAllImages.queryKey(),
        })
      },
    }),
  )

  function addImage() {
    addImageMutate.mutate({
      imageUrl,
      description,
      width,
      height,
    })
  }

  function reset() {
    setImageUrl('')
    setDescription('')
    setWidth(300)
    setHeight(200)
  }

  return (
    <Dialog
      open={albumDialogStore.addDialog}
      onOpenChange={(v) => {
        albumDialogStore.setAddDialogs(v)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => albumDialogStore.setAddDialogs(true)}>
          添加图片
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加图片</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              图片地址
            </Label>
            <Input id="name" disabled value={imageUrl} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              图片描述
            </Label>
            <Input
              id="username"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              宽度
            </Label>
            <Input
              id="width"
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              高度
            </Label>
            <Input
              id="height"
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={reset}>
            重置
          </Button>
          <Button type="submit" onClick={addImage} disabled={!imageUrl}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlbumDialog

'use client'
import { useState } from "react"
import { Button } from "~/components/base/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/base/dialog"
import { Input } from "~/components/base/input"
import { Label } from "~/components/base/label"
import { api } from "~/trpc/react"
import { toast } from "../base"
import { useAlbumDialogsStore } from "~/stores/album"

const AddAlbumDialog: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [height, setHeight] = useState<number>(200)
  const [width, setWidth] = useState<number>(300)
  const albumDialogStore = useAlbumDialogsStore()
  const utils = api.useUtils()

  const addImageMutate = api.album.addImage.useMutation({
    onSuccess: async () => {
      albumDialogStore.setAddDialogs(false)
      toast.success('图片上传成功')
    },
    onError: error => toast.error(error.message),
    onSettled: () => {
      utils.album.getAllImages.invalidate()
    }
  })

  function addImage() {
    addImageMutate.mutate({
      imageUrl,
      description,
      width,
      height
    })
  }

  return (
    <Dialog open={albumDialogStore.addDialog}
      onOpenChange={(v) => {
        albumDialogStore.setAddDialogs(v)
      }}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => albumDialogStore.setAddDialogs(true)}>添加图片</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加图片</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              图片地址
            </Label>
            <Input id="name" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              图片描述
            </Label>
            <Input id="username" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              宽度
            </Label>
            <Input id="width" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              高度
            </Label>
            <Input id="height" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={addImage}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddAlbumDialog;


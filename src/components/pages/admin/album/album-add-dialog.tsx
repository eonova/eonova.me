'use client'

import { useState } from 'react'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { Label } from '~/components/base/label'
import FileUpload from '~/components/pages/album/file-upload'
import { useAddAlbumImage } from '~/hooks/queries/album.query'
import { useAlbumDialogsStore } from '~/stores/album'

export default function AddAlbumDialog() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [height, setHeight] = useState<number>(200)
  const [width, setWidth] = useState<number>(300)

  const { addDialog, setAddDialogs } = useAlbumDialogsStore()

  const { mutate, isPending } = useAddAlbumImage(() => {
    setAddDialogs(false)
    reset()
  })

  function handleAdd() {
    mutate({
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
      open={addDialog}
      onOpenChange={setAddDialogs}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setAddDialogs(true)}>
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
            <Label htmlFor="url" className="text-left">
              图片地址
            </Label>
            <Input id="url" disabled value={imageUrl} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              图片描述
            </Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-left">
              宽度
            </Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-left">
              高度
            </Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAdd} disabled={isPending || !imageUrl}>
            {isPending ? '添加中...' : '确认添加'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

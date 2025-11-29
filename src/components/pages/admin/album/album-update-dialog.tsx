'use client'

import { useEffect, useState } from 'react'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { Label } from '~/components/base/label'
import FileUpload from '~/components/pages/album/file-upload'
import { useUpdateAlbumImage } from '~/hooks/queries/album.query'
import { useAlbumDialogsStore } from '~/stores/album'

export default function UpdateAlbumDialog() {
  const { updateDialog, setUpdateDialogs, currentImage } = useAlbumDialogsStore()

  const [imageUrl, setImageUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (currentImage) {
      setImageUrl(currentImage.imageUrl)
      setDescription(currentImage.description || '')
      setHeight(currentImage.height || 0)
      setWidth(currentImage.width || 0)
    }
  }, [currentImage])

  const { mutate, isPending } = useUpdateAlbumImage(() => {
    setUpdateDialogs(false)
  })

  function handleUpdate() {
    if (!currentImage)
      return
    mutate({
      id: currentImage.id,
      imageUrl,
      description,
      width,
      height,
    })
  }

  return (
    <Dialog open={updateDialog} onOpenChange={setUpdateDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>更新图片</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-url" className="text-left">
              图片地址
            </Label>
            <Input id="update-url" disabled value={imageUrl} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-desc" className="text-left">
              图片描述
            </Label>
            <Input
              id="update-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-width" className="text-left">
              宽度
            </Label>
            <Input
              id="update-width"
              type="number"
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-height" className="text-left">
              高度
            </Label>
            <Input
              id="update-height"
              type="number"
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleUpdate} disabled={isPending || !imageUrl}>
            {isPending ? '更新中...' : '确认更新'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

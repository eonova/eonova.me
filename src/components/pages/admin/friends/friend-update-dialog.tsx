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
import { useUpdateFriend } from '~/hooks/queries/friend.query'
import { useFriendDialogsStore } from '~/stores/friend'

export default function UpdateFriendDialog() {
  const { updateDialog, setUpdateDialogs, currentFriend } = useFriendDialogsStore()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(0)

  useEffect(() => {
    if (currentFriend) {
      setName(currentFriend.name)
      setUrl(currentFriend.url)
      setAvatar(currentFriend.avatar || '')
      setDescription(currentFriend.description || '')
      setOrder(currentFriend.order || 0)
    }
  }, [currentFriend])

  const { mutate, isPending } = useUpdateFriend(() => {
    setUpdateDialogs(false)
  })

  function handleUpdate() {
    if (!currentFriend)
      return
    mutate({
      id: currentFriend.id,
      name,
      url,
      avatar,
      description,
    })
  }

  return (
    <Dialog open={updateDialog} onOpenChange={setUpdateDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>更新友链</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-name" className="text-left">
              名称
            </Label>
            <Input
              id="update-name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-url" className="text-left">
              链接
            </Label>
            <Input
              id="update-url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-avatar" className="text-left">
              头像
            </Label>
            <Input
              id="update-avatar"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-description" className="text-left">
              描述
            </Label>
            <Input
              id="update-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-order" className="text-left">
              排序
            </Label>
            <Input
              id="update-order"
              type="number"
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleUpdate} disabled={isPending || !name || !url}>
            {isPending ? '更新中...' : '确认更新'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

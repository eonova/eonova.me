'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { Label } from '~/components/base/label'
import { Switch } from '~/components/base/switch'
import { useUpdateFriend } from '~/hooks/queries/friend.query'
import { useFriendDialogs } from '~/hooks/use-friend-dialogs'

export default function UpdateFriendDialog() {
  const { updateDialog, setUpdateDialogs, currentFriend } = useFriendDialogs()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (currentFriend) {
      setName(currentFriend.name)
      setUrl(currentFriend.url)
      setAvatar(currentFriend.avatar || '')
      setDescription(currentFriend.description || '')
      setOrder(currentFriend.order || 0)
      setActive(currentFriend.active || false)
    }
  }, [currentFriend])

  const { mutate, isPending } = useUpdateFriend(() => {
    setUpdateDialogs(false)
    toast.success('更新成功')
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
      active,
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-active" className="text-left">
              审核状态
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="update-active"
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="update-active" className="cursor-pointer text-sm font-normal text-gray-500">
                {active ? '已通过' : '待审核'}
              </Label>
            </div>
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

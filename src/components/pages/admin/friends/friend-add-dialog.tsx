'use client'

import { useState } from 'react'
import { toast } from 'sonner'
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
import { useCreateFriend } from '~/hooks/queries/friend.query'
import { useFriendDialogs } from '~/hooks/use-friend-dialogs'

export default function AddFriendDialog({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [description, setDescription] = useState('')

  const { addDialog, setAddDialogs } = useFriendDialogs()

  const isOpen = open ?? addDialog
  const setOpen = onOpenChange ?? setAddDialogs

  function reset() {
    setName('')
    setUrl('')
    setAvatar('')
    setDescription('')
  }

  const { mutate, isPending } = useCreateFriend(() => {
    setOpen(false)
    reset()
    toast.success('提交成功，请等待管理员审核')
  })

  function handleAdd() {
    mutate({
      name,
      url,
      avatar,
      description,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!onOpenChange && (
          <Button variant="outline" onClick={() => setOpen(true)}>
            添加友链
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加友链</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              名称
            </Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-left">
              链接
            </Label>
            <Input
              id="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-left">
              头像
            </Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              描述
            </Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAdd} disabled={isPending || !name || !url}>
            {isPending ? '添加中...' : '确认添加'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

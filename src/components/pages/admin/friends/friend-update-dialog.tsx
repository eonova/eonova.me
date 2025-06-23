'use client'

import { useMutation } from '@tanstack/react-query'
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
import { useFriendDialogsStore } from '~/stores/friend'
import { useTRPC } from '~/trpc/client'

interface UpdateFriendDialogProps {
  id: string
}

const UpdateFriendDialog: React.FC<UpdateFriendDialogProps> = ({ id }) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [description, setDescription] = useState('')
  const friendDialogStore = useFriendDialogsStore()
  const trpc = useTRPC()

  const updateMutation = useMutation(
    trpc.friend.updateFriend.mutationOptions({
      onSuccess: () => {
        friendDialogStore.setAddDialogs(false)
        toast.success('友链更新成功')
      },
      onError: error => toast.error(`添加失败：${error.message}`),
      onSettled: () => trpc.friend.getAllFriends.queryOptions(),
    }),
  )

  const handleSubmit = () => {
    updateMutation.mutate({
      id,
      name,
      url,
      avatar,
      description,
    })
    setName('')
    setUrl('')
    setAvatar('')
    setDescription('')
  }

  return (
    <Dialog
      open={friendDialogStore.addDialog}
      onOpenChange={v => friendDialogStore.setAddDialogs(v)}
    >
      <DialogTrigger asChild>
        <Button variant="outline">新增友链</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加友链</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名称
            </Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              链接
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              头像
            </Label>
            <Input
              id="avatar"
              type="url"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              描述
            </Label>
            <Input
              id="description"
              type="url"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFriendDialog

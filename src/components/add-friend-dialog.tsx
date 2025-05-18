import React, { useState } from 'react'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { api } from '~/trpc/react'
import { toast } from './base/toaster'

// 假设你有 createFriend 的 mutation hook
// import { useCreateFriend } from '~/hooks/useCreateFriend'

interface AddFriendDialogProps {
  open: boolean
  onClose: () => void
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  open,
  onClose,
}) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [description, setDescription] = useState('')

  const handleClose = () => {
    setName('')
    setUrl('')
    setAvatar('')
    setDescription('')
    onClose()
  }

  const utils = api.useUtils()
  const createFriendMutate = api.friend.createFriend.useMutation({
    onSuccess: () => {
      handleClose()
      toast.success('好友添加成功')
    },
    onError: (error) => {
      console.error('添加好友失败:', error)
    },
    onSettled: () => {
      utils.friend.getAllFriends.invalidate()
    },
  })
  const handleAdd = async () => {
    createFriendMutate.mutate({
      name: name.trim(),
      url: url.trim(),
      avatar: avatar.trim(),
      description: description.trim(),
    })
    setName('')
    setUrl('')
    setAvatar('')
    setDescription('')
    onClose()
  }
  const canSubmit = name.trim() && url.trim()

  return (
    <Dialog open={open} onOpenChange={open => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加好友</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            autoFocus
            placeholder="名称"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            placeholder="URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <Input
            placeholder="头像URL（可选）"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
          <Input
            placeholder="描述（可选）"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
          </DialogClose>
          <Button onClick={handleAdd} disabled={!canSubmit}>
            添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriendDialog

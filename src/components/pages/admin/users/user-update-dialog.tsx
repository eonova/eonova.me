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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/base/select'
import { useUpdateUser } from '~/hooks/queries/admin.query'
import { useUserDialogs } from '~/hooks/use-user-dialogs'

export default function UpdateUserDialog() {
  const { updateDialog, setUpdateDialogs, currentUser } = useUserDialogs()

  const [name, setName] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name)
      setRole(currentUser.role as 'user' | 'admin')
    }
  }, [currentUser])

  const { mutate, isPending } = useUpdateUser(() => {
    setUpdateDialogs(false)
    toast.success('更新成功')
  })

  function handleUpdate() {
    if (!currentUser)
      return
    mutate({
      id: currentUser.id,
      name,
      role,
    })
  }

  return (
    <Dialog open={updateDialog} onOpenChange={setUpdateDialogs}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>更新用户</DialogTitle>
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
            <Label htmlFor="update-role" className="text-left">
              角色
            </Label>
            <div className="col-span-3">
              <Select
                value={role}
                onValueChange={value => setRole(value as 'user' | 'admin')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">用户</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleUpdate} disabled={isPending || !name}>
            {isPending ? '更新中...' : '确认更新'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

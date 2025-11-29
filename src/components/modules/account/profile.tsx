'use client'

import type { AvatarMimeType } from '~/config/constants'
import type { User } from '~/lib/auth-client'
import { useForm } from '@tanstack/react-form'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/base/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/base/avatar'
import { Button } from '~/components/base/button'
import { Card } from '~/components/base/card'
import { Field, FieldError } from '~/components/base/field'
import { Input } from '~/components/base/input'

import { AVATAR_MAX_FILE_SIZE, SUPPORTED_AVATAR_MIME_TYPES } from '~/config/constants'
import { useUpdateUser } from '~/hooks/queries/auth.query'
import { useGetAvatarUploadUrl } from '~/hooks/queries/r2.query'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { useSession } from '~/lib/auth-client'
import { getAbbreviation } from '~/utils/get-abbreviation'

import ProfileSkeleton from './profile-skeleton'

function Profile() {
  const { data, isPending: isSessionLoading } = useSession()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">个人资料</h2>
      {isSessionLoading && <ProfileSkeleton />}
      {data && <ProfileInfo user={data.user} />}
    </div>
  )
}

interface ProfileInfoProps {
  user: User
}

function ProfileInfo(props: ProfileInfoProps) {
  const { user } = props
  const createdAt = useFormattedDate(user.createdAt, {
    format: 'MMMM D, YYYY, HH:mm:ss',
  })
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">头像</span>
          <Avatar className="size-24">
            <AvatarImage src={user.image ?? undefined} className="size-full" />
            <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <UpdateAvatar />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">显示头像</span>
          <span>{user.name}</span>
        </div>
        <EditName name={user.name} />
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">邮箱</span>
          <span>{user.email}</span>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">账户已创建</span>
          <span>{createdAt}</span>
        </div>
      </div>
    </Card>
  )
}

interface EditNameProps {
  name: string
}

function EditName(props: EditNameProps) {
  const { name } = props
  const [open, setOpen] = useState(false)
  const { refetch: refetchSession } = useSession()

  const editNameFormSchema = z.object({
    name: z.string().min(1, '名称不能为空').max(50, '名字太长'),
  })

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(() => {
    setOpen(false)
    toast.success('名称已更新')
    refetchSession()
  })

  const form = useForm({
    defaultValues: {
      name,
    },
    validators: {
      onSubmit: editNameFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isUpdating)
        return
      updateUser({ name: value.name })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">编辑名称</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>编辑名称</AlertDialogTitle>
            <AlertDialogDescription>编辑名称描述</AlertDialogDescription>
          </AlertDialogHeader>
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    aria-invalid={isInvalid}
                    placeholder="显示名称"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button type="submit">保存</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function UpdateAvatar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { refetch: refetchSession } = useSession()

  const { mutateAsync: getAvatarUploadUrl } = useGetAvatarUploadUrl()
  const { mutateAsync: updateUser } = useUpdateUser(() => {
    toast.success('头像更新')
    refetchSession()
  })

  const handleSelectFile = () => {
    if (isUploading)
      return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file)
      return

    event.target.value = ''

    if (!SUPPORTED_AVATAR_MIME_TYPES.includes(file.type as AvatarMimeType)) {
      toast.error('头像不支持的文件类型')
      return
    }

    if (file.size > AVATAR_MAX_FILE_SIZE) {
      const maxSizeInMb = (AVATAR_MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
      toast.error(`头像太大: ${maxSizeInMb}`)
      return
    }

    try {
      setIsUploading(true)

      const { uploadUrl, publicUrl } = await getAvatarUploadUrl({
        fileName: file.name,
        fileType: file.type as AvatarMimeType,
        fileSize: file.size,
      })

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      await updateUser({ image: publicUrl })
    }
    catch {
      toast.error('更新头像失败')
    }
    finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_AVATAR_MIME_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="outline" onClick={handleSelectFile} disabled={isUploading}>
        更新头像
      </Button>
    </div>
  )
}

export default Profile

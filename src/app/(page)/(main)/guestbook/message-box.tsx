'use client'

import type { User } from '~/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Skeleton,
  Textarea,
  toast,
} from '~/components/base'
import { signOut } from '~/lib/auth-client'
import { api } from '~/trpc/react'
import { getDefaultImage } from '~/utils/get-default-image'

interface FormProps {
  user: User
}

function MessageBox(props: FormProps) {
  const { user } = props
  const utils = api.useUtils()

  const guestbookFormSchema = z.object({
    message: z.string().min(1, {
      message: '留言不能为空',
    }),
  })

  const form = useForm<z.infer<typeof guestbookFormSchema>>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      message: '',
    },
  })

  const guestbookMutation = api.guestbook.create.useMutation({
    onSuccess: () => {
      form.reset()
      toast.success('成功发布留言')
    },
    onSettled: () => utils.guestbook.invalidate(),
    onError: error => toast.error(error.message),
  })

  const onSubmit = (values: z.infer<typeof guestbookFormSchema>) => {
    guestbookMutation.mutate({
      message: values.message,
    })
  }
  const defaultImage = getDefaultImage(user.id)

  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarImage src={user.image ?? defaultImage} alt={user.name} className="size-10" />
        <AvatarFallback className="bg-transparent">
          <Skeleton className="size-10 rounded-full" />
        </AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="留言" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                void signOut()
              }}
            >
              登出
            </Button>
            <Button
              type="submit"
              disabled={guestbookMutation.isPending}
              aria-disabled={guestbookMutation.isPending}
            >
              提交
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default MessageBox

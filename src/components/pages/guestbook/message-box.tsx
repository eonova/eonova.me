'use client'

import type { User } from '~/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Skeleton,
  Textarea,
} from '~/components/base'
import { useCreateMessage } from '~/hooks/queries/message.query'
import { useSignOut } from '~/hooks/use-sign-out'
import { getDefaultImage } from '~/utils'

interface FormProps {
  user: User
}

function MessageBox(props: Readonly<FormProps>) {
  const { user } = props
  const signOut = useSignOut()

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
  const { mutate: createMessage, isPending: isCreating } = useCreateMessage(() => {
    form.reset()
    toast.success('成功发布留言')
  })
  const guestbookMutation = { isPending: isCreating }

  const onSubmit = (values: z.infer<typeof guestbookFormSchema>) => {
    createMessage({ message: values.message })
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
                <Textarea placeholder="留言" data-testid="guestbook-textarea" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={signOut}
              data-testid="guestbook-logout-button"
            >
              登出
            </Button>
            <Button
              type="submit"
              disabled={guestbookMutation.isPending}
              aria-disabled={guestbookMutation.isPending}
              data-testid="guestbook-submit-button"
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

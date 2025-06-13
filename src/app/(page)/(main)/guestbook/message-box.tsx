'use client'

import type { User } from '~/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useTRPC } from '~/trpc/client'
import { getDefaultImage } from '~/utils'

interface FormProps {
  user: User
}

function MessageBox(props: Readonly<FormProps>) {
  const { user } = props
  const trpc = useTRPC()

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
  const queryClient = useQueryClient()
  const guestbookMutation = useMutation(trpc.guestbook.create.mutationOptions({
    onSuccess: () => {
      form.reset()
      toast.success('成功发布留言')
    },
    onSettled: () => queryClient.invalidateQueries({
      queryKey: trpc.guestbook.getInfiniteMessages.infiniteQueryKey(),
    }),
    onError: error => toast.error(error.message),
  }),
  )

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
                  <Textarea
                    placeholder="留言"
                    data-testid="guestbook-textarea"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => signOut()}
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

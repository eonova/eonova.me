/* eslint-disable ts/no-use-before-define */
'use client'

import type { User } from '~/lib/auth-client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/base/avatar'
import { Button } from '~/components/base/button'
import { Field, FieldError, FieldGroup } from '~/components/base/field'
import { Textarea } from '~/components/base/textarea'
import { useCreateMessage } from '~/hooks/queries/message.query'
import { useSignOut } from '~/hooks/use-sign-out'
import { getAbbreviation } from '~/utils/get-abbreviation'
import { getDefaultImage } from '~/utils/get-default-image'

interface MessageBoxProps {
  user: User
}

function MessageBox(props: MessageBoxProps) {
  const { user } = props
  const signOut = useSignOut()

  const GuestbookFormSchema = z.object({
    message: z.string().min(1, '留言不能为空'),
  })

  const form = useForm({
    defaultValues: {
      message: '',
    },
    validators: {
      onSubmit: GuestbookFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isCreating)
        return
      createMessage({ message: value.message })
    },
  })

  const { mutate: createMessage, isPending: isCreating } = useCreateMessage(() => {
    form.reset()
    toast.success('留言成功')
  })
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    form.handleSubmit()
  }

  const defaultImage = getDefaultImage(user.id)

  return (
    <div className="flex gap-4">
      <Avatar className="size-12">
        <AvatarImage src={user.image ?? defaultImage} alt={user.name} />
        <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
      </Avatar>
      <form onSubmit={handleSubmit} className="w-full">
        <FieldGroup>
          <form.Field name="message">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <Textarea
                    className="min-h-20 rounded-2xl"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    aria-invalid={isInvalid}
                    placeholder="留言"
                    disabled={isCreating}
                    data-testid="guestbook-textarea"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={signOut} disabled={isCreating}>
            登出
          </Button>
          <Button type="submit" disabled={isCreating} data-testid="guestbook-submit-button">
            留言
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MessageBox

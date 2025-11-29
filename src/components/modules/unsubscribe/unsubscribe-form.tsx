'use client'

import type { getReplyUnsubData } from '~/lib/unsubscribe'

import { BellOffIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/base/card'

import { useUpdateCommentReplyPrefs } from '~/hooks/queries/unsubscribe.query'

interface UnsubscribeFormProps {
  data: NonNullable<Awaited<ReturnType<typeof getReplyUnsubData>>>
}

function UnsubscribeForm(props: UnsubscribeFormProps) {
  const { data } = props
  const [isUnsubscribed, setIsUnsubscribed] = useState(data.isUnsubscribed)
  const { mutate: updatePrefs, isPending: isUpdating } = useUpdateCommentReplyPrefs(() => {
    setIsUnsubscribed(true)
  })

  const handleUnsubscribe = () => {
    if (isUpdating)
      return
    updatePrefs({ token: data.token })
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent">
          <BellOffIcon className="size-8" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl text-balance">
            {isUnsubscribed
              ? '你已取消订阅此评论'
              : '取消订阅此评论'}
          </CardTitle>
          <CardDescription className="text-base text-pretty text-muted-foreground">
            {isUnsubscribed
              ? '你已取消订阅此评论，将不会再收到此评论的回复通知。'
              : '取消订阅此评论后，将不会再收到此评论的回复通知。'}
          </CardDescription>
        </div>
      </CardHeader>
      {!isUnsubscribed && (
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <p>评论内容</p>
            <div className="rounded-lg border p-3 dark:bg-input/30">
              <p className="text-sm text-pretty text-muted-foreground">{data.comment}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleUnsubscribe} disabled={isUpdating} className="w-full">
              {isUnsubscribed ? '重新订阅' : '取消订阅'}
            </Button>

            <div className="space-y-1 text-center text-xs text-balance text-muted-foreground">
              <p>
                {isUnsubscribed
                  ? `你已取消订阅此评论，将不会再收到此评论的回复通知。`
                  : `取消订阅此评论后，将不会再收到此评论的回复通知。`}
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default UnsubscribeForm

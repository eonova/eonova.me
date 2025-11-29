'use client'

import { SendIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/base/button'

import { useCommentsContext } from '~/contexts/comments.context'
import { useCreateContentComment } from '~/hooks/queries/comment.query'
import { useIsMounted } from '~/hooks/use-is-mounted'
import { useSession } from '~/lib/auth-client'

import CommentEditor from './comment-editor'
import UnauthenticatedOverlay from './unauthenticated-overlay'

function CommentPost() {
  const { slug, contentType } = useCommentsContext()
  const [content, setContent] = useState('')
  const [tabsValue, setTabsValue] = useState<'write' | 'preview'>('write')
  const isMounted = useIsMounted()
  const { data: session, isPending: isSessionLoading } = useSession()

  const { mutate: createComment, isPending: isCreating } = useCreateContentComment({ slug }, contentType, () => {
    setContent('')
    toast.success('评论已发布')
    setTabsValue('write')
  })

  const submitComment = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (isCreating)
      return

    if (!content) {
      toast.error('评论内容不能为空')
      return
    }

    createComment({
      slug,
      content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    })
  }

  if (!isMounted) {
    return null
  }

  const isAuthenticated = session !== null && !isSessionLoading
  const disabled = !isAuthenticated || isCreating

  return (
    <form onSubmit={submitComment}>
      <div className="relative">
        <CommentEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          tabsValue={tabsValue}
          onTabsValueChange={(value) => {
            setTabsValue(value as 'write' | 'preview')
          }}
          onModEnter={submitComment}
          placeholder="写评论..."
          disabled={disabled}
          data-testid="comment-textarea-post"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-1.5 size-7"
          type="submit"
          disabled={disabled || !content}
          aria-label="发送评论"
          aria-disabled={disabled || !content}
          data-testid="comment-submit-button"
        >
          <SendIcon />
        </Button>
        {isAuthenticated ? null : <UnauthenticatedOverlay />}
      </div>
    </form>
  )
}

export default CommentPost

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/base/button'

import { useCommentContext } from '~/contexts/comment.context'
import { useCommentsContext } from '~/contexts/comments.context'
import { useCreateContentComment } from '~/hooks/queries/comment.query'
import { useSession } from '~/lib/auth-client'

import CommentEditor from './comment-editor'
import UnauthenticatedOverlay from './unauthenticated-overlay'

function CommentReply() {
  const [content, setContent] = useState('')
  const { data: session } = useSession()
  const { comment, setIsReplying } = useCommentContext()
  const { slug, contentType } = useCommentsContext()

  const { mutate: createReply, isPending: isCreating } = useCreateContentComment({ slug }, contentType, () => {
    setIsReplying(false)
    toast.success('回复已发布')
  })

  const submitCommentReply = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (isCreating)
      return

    if (!content) {
      toast.error('回复内容不能为空')
      return
    }

    createReply({
      slug,
      content,
      parentId: comment.id,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    })
  }

  const isAuthenticated = session !== null
  const disabled = !isAuthenticated || isCreating

  return (
    <form onSubmit={submitCommentReply}>
      <div className="relative">
        <CommentEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          onModEnter={submitCommentReply}
          onEscape={() => {
            setIsReplying(false)
          }}
          placeholder="回复评论..."
          disabled={disabled}
          autoFocus
          data-testid="comment-textarea-reply"
        />
        {isAuthenticated ? null : <UnauthenticatedOverlay />}
      </div>
      <div className="mt-2 space-x-1">
        <Button
          variant="secondary"
          className="h-8 px-2 text-xs font-medium"
          type="submit"
          disabled={disabled || !content}
          aria-disabled={disabled || !content}
          data-testid="comment-submit-reply-button"
        >
          回复
        </Button>
        <Button
          variant="secondary"
          className="h-8 px-2 text-xs font-medium"
          onClick={() => {
            setIsReplying(false)
          }}
        >
          取消
        </Button>
      </div>
    </form>
  )
}

export default CommentReply

'use client'

import { useMutation } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, toast } from '~/components/base'
import { useCommentsContext } from '~/contexts/comments'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useSession } from '~/lib/auth-client'
import { useTRPCInvalidator } from '~/lib/trpc-invalidator'

import { useTRPC } from '~/trpc/client'
import CommentEditor from './comment-editor'
import UnauthorizedOverlay from './unauthorized-overlay'

function CommentContent() {
  const { slug, sort, type } = useCommentsContext()
  const [params] = useCommentParams()
  const [content, setContent] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { data: session, isPending } = useSession()
  const trpc = useTRPC()
  const invalidator = useTRPCInvalidator()

  // 使用統一的查詢鍵助手
  const infiniteCommentsParams = {
    slug,
    sort,
    type: 'comments' as const,
    highlightedCommentId: params.comment ?? undefined,
  }

  const commentsMutation = useMutation(
    trpc.comments.send.mutationOptions(
      {
        onSuccess: () => {
          setContent('')
          toast.success('评论已发布')
        },
        onError: (error) => {
          toast.error(error.message)
        },
        onSettled: async () => {
          await invalidator.comments.invalidateAfterAction({
            slug,
            infiniteCommentsParams,
          })
        },
      },
    ),
  )

  const submitComment = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!content) {
      toast.error('评论不能为空')

      return
    }

    commentsMutation.mutate({
      slug,
      content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      type,
    })
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const isAuthenticated = session !== null && !isPending
  const disabled = !isAuthenticated || commentsMutation.isPending

  return (
    <form onSubmit={submitComment}>
      <div className="relative">
        <CommentEditor
          value={content}
          onChange={e => setContent(e.target.value)}
          onModEnter={submitComment}
          placeholder="留下评论"
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
          <SendIcon className="size-4" />
        </Button>
        {isAuthenticated ? null : <UnauthorizedOverlay />}
      </div>
    </form>
  )
}

export default CommentContent

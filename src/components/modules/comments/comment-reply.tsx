'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { toast } from '~/components/base/toaster'
import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useSession } from '~/lib/auth-client'
import { useTRPCInvalidator } from '~/lib/trpc-invalidator'
import { createTRPCQueryKeys } from '~/lib/trpc-query-helpers'
import { useTRPC } from '~/trpc/client'
import CommentEditor from './comment-editor'
import UnauthorizedOverlay from './unauthorized-overlay'

function CommentReply() {
  const [content, setContent] = useState('')
  const { data: session } = useSession()
  const { comment, setIsReplying } = useCommentContext()
  const { slug, sort, type } = useCommentsContext()
  const [params] = useCommentParams()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const invalidator = useTRPCInvalidator()

  const queryKeys = createTRPCQueryKeys(trpc)
  const infiniteCommentsParams = {
    slug,
    sort,
    type: 'comments' as const,
    highlightedCommentId: params.comment ?? undefined,
  }

  const commentsMutation = useMutation(
    trpc.comments.send.mutationOptions({
      onMutate: async () => {
        const queryKey = queryKeys.comments.infiniteComments(infiniteCommentsParams)

        await queryClient.cancelQueries({ queryKey })
        const previousData = queryClient.getQueryData(queryKey)

        // 樂觀更新
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData)
            return { pages: [], pageParams: [] }

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              comments: page.comments.map(c =>
                c.id === comment.id ? { ...c, replies: c.replies + 1 } : c,
              ),
            })),
          }
        })

        return { previousData }
      },
      onSuccess: () => {
        setIsReplying(false)
        toast.success('回复已发布')
      },
      onError: (error, _, ctx) => {
        if (ctx?.previousData) {
          queryClient.setQueryData(
            queryKeys.comments.infiniteComments(infiniteCommentsParams),
            ctx.previousData,
          )
        }
        toast.error(error.message)
      },
      onSettled: async () => {
        await invalidator.comments.invalidateAfterReply({
          slug,
          parentCommentId: comment.id,
          mainCommentsParams: infiniteCommentsParams,
          replyHighlightedId: params.reply ?? void 0,
        })
      },
    }),
  )

  const submitCommentReply = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!content) {
      toast.error('回复不能为空')

      return
    }

    commentsMutation.mutate({
      slug,
      content,
      parentId: comment.id,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      type,
    })
  }

  const isAuthenticated = session !== null
  const disabled = !isAuthenticated || commentsMutation.isPending

  return (
    <form onSubmit={submitCommentReply}>
      <div className="relative">
        <CommentEditor
          onChange={(e) => {
            setContent(e.target.value)
          }}
          onModEnter={submitCommentReply}
          onEscape={() => {
            setIsReplying(false)
          }}
          placeholder="回复评论"
          disabled={disabled}
          autoFocus
        />
        {isAuthenticated ? null : <UnauthorizedOverlay />}
      </div>
      <div className="mt-2 space-x-1">
        <Button
          variant="secondary"
          className="h-8 px-2 text-xs font-medium"
          type="submit"
          disabled={disabled || !content}
          aria-disabled={disabled || !content}
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

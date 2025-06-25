'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { toast } from '~/components/base/toaster'
import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useSession } from '~/lib/auth-client'
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

  const queryKey = {
    slug,
    sort,
    type: 'comments',
    highlightedCommentId: params.comment ?? undefined,
  } as const

  const commentsMutation = useMutation(
    trpc.comments.send.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: trpc.comments.getInfiniteComments.infiniteQueryKey(queryKey),
        })

        const previousData = queryClient.getQueryData(
          trpc.comments.getInfiniteComments.infiniteQueryKey(queryKey),
        )

        queryClient.setQueryData(
          trpc.comments.getInfiniteComments.infiniteQueryKey(queryKey),
          (oldData) => {
            if (!oldData) {
              return {
                pages: [],
                pageParams: [],
              }
            }

            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  comments: page.comments.map((c) => {
                    if (c.id === comment.id) {
                      return {
                        ...c,
                        replies: c.replies + 1,
                      }
                    }
                    return c
                  }),
                }
              }),
            }
          },
        )

        return { previousData }
      },
      onSuccess: () => {
        setIsReplying(false)
        toast.success('回复已发布')
      },
      onError: (error, _, ctx) => {
        if (ctx?.previousData) {
          queryClient.setQueryData(
            trpc.comments.getInfiniteComments.infiniteQueryKey(queryKey),
            ctx.previousData,
          )
        }
        toast.error(error.message)
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getInfiniteComments.infiniteQueryKey(queryKey),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getCommentsCount.queryKey({ slug }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getRepliesCount.queryKey({ slug }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getTotalCommentsCount.queryKey({ slug }),
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

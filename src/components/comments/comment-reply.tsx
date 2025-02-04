'use client'

import type { GetInfiniteCommentsInput } from '~/trpc/routers/comments'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { api } from '~/trpc/react'

import { Button } from '../base/button'
import { toast } from '../base/toaster'
import CommentEditor from './comment-editor'
import UnauthorizedOverlay from './unauthorized-overlay'

function CommentReply() {
  const [content, setContent] = useState('')
  const { comment, setIsReplying } = useCommentContext()
  const { status } = useSession()
  const { slug, sort } = useCommentsContext()
  const utils = api.useUtils()

  const queryKey: GetInfiniteCommentsInput = {
    slug,
    sort,
  }

  const commentsMutation = api.comments.post.useMutation({
    onMutate: async () => {
      await utils.comments.getInfiniteComments.cancel(queryKey)

      const previousData = utils.comments.getInfiniteComments.getInfiniteData(queryKey)

      utils.comments.getInfiniteComments.setInfiniteData(queryKey, (oldData) => {
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
      })

      return { previousData }
    },
    onSuccess: () => {
      setIsReplying(false)
    },
    onError: (error, _, ctx) => {
      if (ctx?.previousData) {
        utils.comments.getInfiniteComments.setInfiniteData(queryKey, ctx.previousData)
      }
      toast.error(error.message)
    },
    onSettled: () => {
      utils.comments.invalidate()
    },
  })

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
    })
  }

  const disabled = status === 'unauthenticated' || commentsMutation.isLoading

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
        {status === 'unauthenticated' ? <UnauthorizedOverlay /> : null}
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

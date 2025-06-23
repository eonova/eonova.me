'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, toast } from '~/components/base'
import { useCommentsContext } from '~/contexts/comments'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useSession } from '~/lib/auth-client'
import { useTRPC } from '~/trpc/client'

import CommentEditor from './comment-editor'
import UnauthorizedOverlay from './unauthorized-overlay'

function CommentPost() {
  const { slug, sort } = useCommentsContext()
  const [params] = useCommentParams()
  const [content, setContent] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { data: session, isPending } = useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const commentsMutation = useMutation(
    trpc.comments.post.mutationOptions({
      onSuccess: () => {
        setContent('')
        toast.success('评论已发布')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getInfiniteComments.infiniteQueryKey({
            slug,
            sort,
            type: 'comments',
            highlightedCommentId: params.comment ?? undefined,
          }),
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

  const submitComment = () => {
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
    })
  }

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  if (isPending || !isMounted)
    return null

  const disabled = session === null || commentsMutation.isPending

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submitComment()
      }}
    >
      <div className="relative">
        <CommentEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          onModEnter={submitComment}
          placeholder="留下评论"
          disabled={disabled}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-1.5 size-7"
          type="submit"
          disabled={disabled || !content}
          aria-label="发送评论"
          aria-disabled={disabled || !content}
        >
          <SendIcon className="size-4" />
        </Button>
        {status === 'unauthenticated' ? <UnauthorizedOverlay /> : null}
      </div>
    </form>
  )
}

export default CommentPost

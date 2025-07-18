'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useTRPC } from '~/trpc/client'

import Comment from './comment'
import CommentLoader from './comment-loader'

function CommentReplies() {
  const { comment, isOpenReplies, setIsOpenReplies } = useCommentContext()
  const { slug } = useCommentsContext()
  const [params] = useCommentParams()

  const trpc = useTRPC()
  const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.comments.getInfiniteComments.infiniteQueryOptions(
      {
        slug,
        sort: 'oldest',
        parentId: comment.id,
        type: 'replies',
        highlightedCommentId: params.reply ?? undefined,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
        enabled: isOpenReplies,
      },
    ),
  )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage)
      fetchNextPage()
  }, [fetchNextPage, hasNextPage, inView])

  useEffect(() => {
    if (params.comment === comment.id)
      setIsOpenReplies(true)
  }, [comment.id, params.comment, setIsOpenReplies])

  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isLoading = status === 'pending' || isFetchingNextPage

  return (
    <>
      {isOpenReplies
        ? (
            <div className="space-y-8 pl-7">
              {isSuccess
                ? data.pages.map(page =>
                    page.comments.map(reply => <Comment key={reply.id} comment={reply} />),
                  )
                : null}
              {isError
                ? (
                    <div className="flex min-h-20 items-center justify-center">
                      <p className="text-muted-foreground text-sm">无法载入回复。请刷新页面。</p>
                    </div>
                  )
                : null}
              {isLoading ? <CommentLoader /> : null}
              <span ref={ref} className="invisible" />
            </div>
          )
        : null}
    </>
  )
}

export default CommentReplies

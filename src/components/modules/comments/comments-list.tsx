'use client'

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { getSingletonHighlighterCore } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import githubDarkDefault from 'shiki/themes/github-dark-default.mjs'
import githubLightDefault from 'shiki/themes/github-light-default.mjs'
import { useCommentsContext } from '~/contexts/comments'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useHighlighterStore } from '~/stores/highlighter'
import { useTRPC } from '~/trpc/client'

import Comment from './comment'
import CommentLoader from './comment-loader'
import CommentHeader from './comments-header'

function CommentsList() {
  const { slug, sort } = useCommentsContext()
  const [params] = useCommentParams()
  const { highlighter, setHighlighter } = useHighlighterStore()

  const trpc = useTRPC()
  const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.comments.getInfiniteComments.infiniteQueryOptions(
      {
        slug,
        sort,
        type: 'comments',
        highlightedCommentId: params.comment ?? undefined,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
        placeholderData: keepPreviousData,
      },
    ),
  )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage)
      fetchNextPage()
  }, [fetchNextPage, hasNextPage, inView])

  useEffect(() => {
    if (highlighter)
      return

    getSingletonHighlighterCore({
      themes: [githubLightDefault, githubDarkDefault],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    }).then((instance) => {
      setHighlighter(instance)
    })
  }, [])

  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isLoading = status === 'pending' || isFetchingNextPage
  const noComments = status === 'success' && data.pages[0]?.comments.length === 0

  return (
    <>
      <CommentHeader />
      <div className="space-y-8 py-2" data-testid="comments-list">
        {isSuccess
          ? data.pages.map(page =>
              page.comments.map(comment => <Comment key={comment.id} comment={comment} />),
            )
          : null}
        {noComments
          ? (
              <div className="flex min-h-20 items-center justify-center">
                <p className="text-muted-foreground text-sm">没有评论</p>
              </div>
            )
          : null}
        {isError
          ? (
              <div className="flex min-h-20 items-center justify-center">
                <p className="text-muted-foreground text-sm">无法载入评论。请刷新页面。</p>
              </div>
            )
          : null}
        {isLoading ? <CommentLoader /> : null}
        <span ref={ref} className="invisible" />
      </div>
    </>
  )
}

export default CommentsList

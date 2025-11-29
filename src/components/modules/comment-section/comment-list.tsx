'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { getSingletonHighlighterCore } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import githubDarkDefault from 'shiki/themes/github-dark-default.mjs'
import githubLightDefault from 'shiki/themes/github-light-default.mjs'

import { useCommentsContext } from '~/contexts/comments.context'
import { useListComments } from '~/hooks/queries/comment.query'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useHighlighter } from '~/hooks/use-highlighter'

import Comment from './comment'
import CommentHeader from './comment-header'
import CommentLoader from './comment-loader'

function CommentList() {
  const { slug, sort, contentType } = useCommentsContext()
  const [params] = useCommentParams()
  const [highlighter, setHighlighter] = useHighlighter()

  const { isSuccess, isLoading, isError, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useListComments(
    pageParam => ({
      slug,
      sort,
      type: 'comments',
      highlightedCommentId: params.comment ?? undefined,
      cursor: pageParam,
    }),
    contentType,
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
      engine: createJavaScriptRegexEngine(),
    }).then((instance) => {
      setHighlighter(instance)
    })
  }, [])

  const noComments = isSuccess && data.pages[0]?.comments.length === 0

  return (
    <>
      <CommentHeader />
      <div className="space-y-8 py-2" data-testid="comments-list">
        {isSuccess
          && data.pages.map(page => page.comments.map(comment => <Comment key={comment.id} comment={comment} />))}
        {(isLoading || isFetchingNextPage) && <CommentLoader />}
        {isError && (
          <div className="flex min-h-20 items-center justify-center">
            <p className="text-sm text-muted-foreground">加载评论失败</p>
          </div>
        )}
        {noComments && (
          <div className="flex min-h-20 items-center justify-center">
            <p className="text-sm text-muted-foreground">暂无评论</p>
          </div>
        )}
        <span ref={ref} className="invisible" />
      </div>
    </>
  )
}

export default CommentList

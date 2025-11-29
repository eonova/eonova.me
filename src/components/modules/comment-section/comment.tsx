'use client'

import type { CommentContextValue } from '~/contexts/comment.context'

import type { ListCommentsOutput } from '~/orpc/routers'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '~/components/base/badge'
import { Skeleton } from '~/components/base/skeleton'

import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/base/tooltip'
import { CommentProvider } from '~/contexts/comment.context'
import { useCommentsContext } from '~/contexts/comments.context'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { getDefaultImage } from '~/utils/get-default-image'

import Markdown from '../mdx/markdown'

import CommentActions from './comment-actions'
import CommentMenu from './comment-menu'
import CommentReplies from './comment-replies'
import CommentReply from './comment-reply'

interface CommentProps {
  comment: ListCommentsOutput['comments'][number]
}

function Comment(props: CommentProps) {
  const { comment } = props

  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isOpenReplies, setIsOpenReplies] = useState(false)

  const commentRef = useRef<HTMLDivElement>(null)

  const [params] = useCommentParams()
  const { slug } = useCommentsContext()

  const isHighlighted = params.reply ? params.reply === comment.id : params.comment === comment.id

  const {
    id,
    body,
    createdAt,
    isDeleted,
    parentId,
    user: { id: userId, image, name, role },
    replyCount,
  } = comment

  const formattedDate = useFormattedDate(comment.createdAt, {
    format: 'MMMM D, YYYY, HH:mm:ss',
  })

  useEffect(() => {
    if (isHighlighted && commentRef.current) {
      const top = commentRef.current.getBoundingClientRect().top + window.scrollY - 128

      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [isHighlighted])

  const hasReplies = !parentId && replyCount > 0

  const defaultImage = getDefaultImage(userId)

  const context = useMemo<CommentContextValue>(
    () => ({
      isEditing,
      isReplying,
      isOpenReplies,
      setIsEditing,
      setIsReplying,
      setIsOpenReplies,
      slug,
      comment,
    }),
    [comment, isEditing, isOpenReplies, isReplying, slug],
  )

  return (
    <CommentProvider value={context}>
      <div ref={commentRef} className="p-2.5" data-testid={`comment-${id}`}>
        {isHighlighted && <Badge className="mb-4">高亮评论</Badge>}
        <div className="flex gap-4">
          <Image src={image ?? defaultImage} alt={name} width={32} height={32} className="z-10 size-8 rounded-full" />
          <div className="flex-1 overflow-hidden">
            <div className="ml-0.5 flex h-8 items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="max-w-35 truncate font-semibold sm:max-w-none">{name}</div>
                <div className="text-muted-foreground">
                  {formattedDate
                    ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <span>{formattedDate}</span>
                          </TooltipTrigger>
                          <TooltipContent>{new Date(createdAt).toLocaleString()}</TooltipContent>
                        </Tooltip>
                      )
                    : (
                        <Skeleton className="h-4 w-24" />
                      )}
                </div>
                {role === 'admin' && (
                  <div className="rounded-full border border-red-500/50 bg-red-100/50 px-2 py-0.5 text-sm dark:bg-red-900/50">
                    作者
                  </div>
                )}
              </div>
              <CommentMenu />
            </div>

            {isDeleted
              ? (
                  <p className="my-3 ml-0.5 text-sm text-muted-foreground">
                    此评论已被删除
                  </p>
                )
              : (
                  <Markdown>{body}</Markdown>
                )}

            {isReplying ? <CommentReply /> : <CommentActions />}
          </div>
        </div>
      </div>
      {hasReplies && <CommentReplies />}
    </CommentProvider>
  )
}

export default Comment

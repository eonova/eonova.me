'use client'

import type { CommentContext } from '~/contexts/comment'

import type { GetInfiniteCommentsOutput } from '~/trpc/routers/comments'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Skeleton } from '~/components/base/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/base/tooltip'
import { CommentProvider } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { useClickOutside } from '~/hooks/use-click-outside'

import { useCommentParams } from '~/hooks/use-comment-params'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { cn } from '~/utils'
import Markdown from '../mdx/markdown'
import CommentActions from './comment-actions'
import CommentMenu from './comment-menu'
import CommentReplies from './comment-replies'
import CommentReply from './comment-reply'

interface CommentProps {
  comment: GetInfiniteCommentsOutput['comments'][number]
}

function Comment(props: CommentProps) {
  const { comment } = props
  const { slug } = useCommentsContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isOpenReplies, setIsOpenReplies] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const [params] = useCommentParams()
  const [isHighlighted, setIsHighlighted] = useState(
    params.comment === comment.id || params.reply === comment.id,
  )

  const {
    body,
    createdAt,
    isDeleted,
    parentId,
    user: { image, name, role },
    replies,
  } = comment

  const formattedDate = useFormattedDate(comment.createdAt, {
    relative: true,
    format: '',
  })

  useClickOutside<HTMLDivElement>(commentRef, () => {
    setIsHighlighted(false)
  })

  const context = useMemo<CommentContext>(
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

  useEffect(() => {
    if (isHighlighted && commentRef.current) {
      const top = commentRef.current.getBoundingClientRect().top + window.scrollY - 128

      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [isHighlighted])

  const hasReplies = !parentId && replies > 0

  return (
    <CommentProvider value={context}>
      <div
        ref={commentRef}
        className={cn('p-2.5', {
          'bg-accent/40 rounded-lg': isHighlighted,
        })}
      >
        <div className="flex gap-4">
          <Image
            src={image}
            alt={name}
            width={32}
            height={32}
            className="z-10 size-8 rounded-full"
          />
          <div className="flex-1">
            <div className="ml-0.5 flex h-8 items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="font-semibold">{name}</div>
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
                {role === 'admin'
                  ? (
                      <div className="rounded-full border border-red-500/50 bg-red-100/50 px-2 py-0.5 text-sm dark:bg-red-900/50">
                        作者
                      </div>
                    )
                  : null}
              </div>
              <CommentMenu />
            </div>

            {isDeleted
              ? (
                  <p className="text-muted-foreground my-3 ml-0.5 text-sm">[此评论已被删除]</p>
                )
              : (
                  <Markdown>{body}</Markdown>
                )}

            {isReplying ? <CommentReply /> : <CommentActions />}
          </div>
        </div>
      </div>
      {hasReplies ? <CommentReplies /> : null}
    </CommentProvider>
  )
}

export default Comment

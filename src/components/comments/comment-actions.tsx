import type { GetInfiniteCommentsInput } from '~/trpc/routers/comments'

import NumberFlow, { continuous } from '@number-flow/react'
import { cva } from 'class-variance-authority'
import { ChevronDownIcon, MessageSquareIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button, buttonVariants, toast } from '~/components/base'
import { useCommentContext } from '~/contexts/comment'

import { useCommentsContext } from '~/contexts/comments'
import { useRatesContext } from '~/contexts/rates'
import { useCommentParams } from '~/hooks/use-comment-params'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const rateVariants = cva(
  buttonVariants({
    variant: 'secondary',
    className: 'h-8 gap-1.5 px-2 font-mono text-xs font-medium',
  }),
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'text-muted-foreground',
      },
    },
  },
)

function CommentActions() {
  const { comment, setIsReplying, isOpenReplies, setIsOpenReplies } = useCommentContext()
  const { increment, decrement, getCount } = useRatesContext()
  const { slug, sort } = useCommentsContext()
  const { status } = useSession()
  const utils = api.useUtils()
  const [params] = useCommentParams()

  const queryKey: GetInfiniteCommentsInput = {
    slug,
    ...(comment.parentId
      ? {
          parentId: comment.parentId,
          sort: 'oldest',
          type: 'replies',
          ...(params.reply ? { highlightedCommentId: params.reply } : {}),
        }
      : { sort, ...(params.comment ? { highlightedCommentId: params.comment } : {}) }),
  }

  const ratesSetMutation = api.rates.set.useMutation({
    onMutate: async (newData) => {
      increment()

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
                if (c.id === newData.id) {
                  let likes: number = c.likes
                  let dislikes: number = c.dislikes

                  if (c.liked === true)
                    likes--
                  if (c.liked === false)
                    dislikes--

                  if (newData.like === true)
                    likes++
                  if (newData.like === false)
                    dislikes++

                  return {
                    ...c,
                    likes,
                    dislikes,
                    liked: newData.like,
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
    onError: (error, _, ctx) => {
      if (ctx?.previousData) {
        utils.comments.getInfiniteComments.setInfiniteData(queryKey, ctx.previousData)
      }
      toast.error(error.message)
    },
    onSettled: () => {
      decrement()

      if (getCount() === 0) {
        void utils.comments.getInfiniteComments.invalidate()
      }
    },
  })

  const isAuthenticated = status === 'authenticated'

  const handleRateComment = (like: boolean) => {
    if (!isAuthenticated) {
      toast.error('您必须登入才能评分评论')
      return
    }
    ratesSetMutation.mutate({ id: comment.id, like: like === comment.liked ? null : like })
  }

  const hasReplies = !comment.parentId && comment.replies > 0

  return (
    <>
      <div className="flex gap-1">
        <Button
          variant="secondary"
          onClick={() => {
            handleRateComment(true)
          }}
          className={rateVariants({
            active: comment.liked === true,
          })}
          aria-label="赞"
        >
          <ThumbsUpIcon className="size-4" />
          <NumberFlow willChange plugins={[continuous]} value={comment.likes} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleRateComment(false)
          }}
          className={rateVariants({
            active: comment.liked === false,
          })}
          aria-label="倒赞"
        >
          <ThumbsDownIcon className="size-4" />
          <NumberFlow willChange plugins={[continuous]} value={comment.dislikes} />
        </Button>
        {comment.parentId
          ? null
          : (
              <Button
                variant="secondary"
                className="text-muted-foreground h-8 gap-1.5 px-2 text-xs font-medium"
                onClick={() => {
                  setIsReplying(true)
                }}
              >
                <MessageSquareIcon className="size-4" />
                回复
              </Button>
            )}
      </div>
      {hasReplies
        ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 h-8 gap-1.5 px-2 text-xs font-medium"
              onClick={() => {
                setIsOpenReplies(!isOpenReplies)
              }}
            >
              <ChevronDownIcon
                className={cn('size-4 transition-transform duration-200', {
                  'rotate-180': isOpenReplies,
                })}
              />
              <NumberFlow willChange plugins={[continuous]} value={comment.replies} />
              {`回复 ${{ count: comment.replies }}`}
            </Button>
          )
        : null}
    </>
  )
}

export default CommentActions

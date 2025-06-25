import NumberFlow, { continuous } from '@number-flow/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cva } from 'class-variance-authority'
import { ChevronDownIcon, MessageSquareIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { Button, buttonVariants, toast } from '~/components/base'
import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'

import { useRatesContext } from '~/contexts/rates'
import { useCommentParams } from '~/hooks/use-comment-params'
import { useSession } from '~/lib/auth-client'
import { useTRPC } from '~/trpc/client'
import { cn } from '~/utils'

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
  const { slug, sort } = useCommentsContext()
  const { comment, setIsReplying, isOpenReplies, setIsOpenReplies } = useCommentContext()
  const { increment, decrement, getCount } = useRatesContext()
  const [params] = useCommentParams()
  const { data: session } = useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const queryKey = {
    slug,
    sort: comment.parentId ? 'oldest' : sort,
    parentId: comment.parentId ?? undefined,
    type: comment.parentId ? 'replies' : 'comments',
    highlightedCommentId: comment.parentId
      ? (params.reply ?? undefined)
      : (params.comment ?? undefined),
  } as const

  const ratesSetMutation = useMutation(
    trpc.rates.set.mutationOptions({
      onMutate: async (newData) => {
        increment()

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
          },
        )

        return { previousData }
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
        decrement()

        if (getCount() === 0) {
          queryClient.invalidateQueries({
            queryKey: trpc.comments.getInfiniteComments.infiniteQueryKey(queryKey),
          })
        }
      },
    }),
  )

  const isAuthenticated = session !== null

  const handleRateComment = (like: boolean) => {
    if (!isAuthenticated) {
      toast.error('需要登录才能点赞')
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
              {`回复 `}
            </Button>
          )
        : null}
    </>
  )
}

export default CommentActions

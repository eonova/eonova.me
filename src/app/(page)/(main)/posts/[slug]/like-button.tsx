'use client'

/**
 * Inspired by: https://framer.university/resources/like-button-component
 */
import NumberFlow, { continuous } from '@number-flow/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { toast } from '~/components/base'
import { Separator } from '~/components/base/separator'
import { useDebouncedCallback } from '~/hooks/use-debounced-callback'
import { useTRPC } from '~/trpc/client'

import { cn } from '~/utils'

interface LikeButtonProps {
  slug: string
  className?: string
}

function LikeButton(props: LikeButtonProps) {
  const { slug, className } = props
  const [cacheCount, setCacheCount] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const queryKey = { slug }

  const { status, data } = useQuery(trpc.likes.get.queryOptions(queryKey))
  const likesMutation = useMutation(
    trpc.likes.patch.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: trpc.likes.get.queryKey(queryKey),
        })

        const previousData = queryClient.getQueryData(trpc.likes.get.queryKey(queryKey))

        queryClient.setQueryData(trpc.likes.get.queryKey(queryKey), (old) => {
          if (!old)
            return old
          return {
            ...old,
            likes: old.likes + newData.value,
            currentUserLikes: old.currentUserLikes + newData.value,
          }
        })
        return { previousData }
      },
      onError: (_, __, ctx) => {
        if (ctx?.previousData) {
          queryClient.setQueryData(trpc.likes.get.queryKey(queryKey), ctx.previousData)
        }
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.likes.get.queryKey(queryKey),
        }),
    }),
  )

  const showConfettiAnimation = async () => {
    const { clientWidth, clientHeight } = document.documentElement
    const boundingBox = buttonRef.current?.getBoundingClientRect()

    const targetY = boundingBox?.y ?? 0
    const targetX = boundingBox?.x ?? 0
    const targetWidth = boundingBox?.width ?? 0

    const targetCenterX = targetX + targetWidth / 2
    const confetti = (await import('canvas-confetti')).default

    await confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 100,
      origin: {
        y: targetY / clientHeight,
        x: targetCenterX / clientWidth,
      },
      shapes: [confetti.shapeFromText({ text: '❤️', scalar: 2 })],
    })
  }

  const onLikeSaving = useDebouncedCallback((value: number) => {
    likesMutation.mutate({ slug, value })
    setCacheCount(0)
  }, 1000)

  const handleLikeButtonClick = () => {
    if (status === 'pending' || !data)
      return
    if (data.currentUserLikes + cacheCount >= 3) {
      toast.error('Like limit reached')
      return
    }

    const value = cacheCount === 3 ? cacheCount : cacheCount + 1
    setCacheCount(value)

    if (data.currentUserLikes + cacheCount === 2) {
      void showConfettiAnimation()
    }

    return onLikeSaving(value)
  }
  return (
    <div className={cn('mt-10 flex justify-center', className)}>
      <motion.button
        ref={buttonRef}
        className="flex items-center gap-2.5 rounded-full border-[#f2eaead2] border-solid dark:border-0 bg-[#f2eaead2] shadow border backdrop-blur-lg dark:bg-zinc-900 px-2.5 py-1.5 text-sm text-black dark:text-white"
        onClick={handleLikeButtonClick}
        aria-label="喜欢这个文章"
        whileTap={{ scale: 0.96 }}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#ef4444"
          className="relative overflow-hidden"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <clipPath id="clip-path">
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </clipPath>
          </defs>
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          <g clipPath="url(#clip-path)">
            <motion.rect
              x="0"
              y="0"
              width="24"
              height="24"
              fill="#ef4444"
              initial={{
                y: '100%',
              }}
              animate={{
                y: data ? `${100 - (data.currentUserLikes + cacheCount) * 33}%` : '100%',
              }}
            />
          </g>
        </svg>
        赞
        <Separator orientation="vertical" className="bg-zinc-700" />
        {status === 'pending' ? <div>--</div> : null}
        {status === 'error' ? <div>错误</div> : null}
        {status === 'success'
          ? (
              <NumberFlow willChange plugins={[continuous]} value={data.likes + cacheCount} data-testid="like-count" />
            )
          : null}
      </motion.button>
    </div>
  )
}

export default LikeButton

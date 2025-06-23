'use client'
import NumberFlow, { continuous } from '@number-flow/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSession } from '~/lib/auth-client'
import { useTRPC } from '~/trpc/client'
import { cn } from '~/utils'

interface LikeButtonProps {
  talkId: string
  initialLikes: number
  className?: string
}

const MAX_LIKES_PER_USER = 3

function LikeButton({ talkId, initialLikes, className }: LikeButtonProps) {
  const { data: session } = useSession()
  const trpc = useTRPC()
  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes)
  const [userLikes, setUserLikes] = useState(0)

  // 从 localStorage 初始化用户点赞次数
  useEffect(() => {
    const storedLikes = localStorage.getItem(`talk-${talkId}-likes`)
    setUserLikes(storedLikes ? Math.min(Number(storedLikes), MAX_LIKES_PER_USER) : 0)
  }, [talkId])
  const queryClient = useQueryClient()

  // 点赞 mutation
  const { mutate: incrementLike } = useMutation(
    trpc.talks.incrementLikes.mutationOptions({
      onMutate: async () => {
        await trpc.talks.getAllTalks.queryOptions()

        // 乐观更新直接使用最新值
        setOptimisticLikes(prev => prev + 1)

        return { previousLikes: optimisticLikes }
      },
      onError: (_, __, context) => {
        // 回滚到之前的值
        setOptimisticLikes(context?.previousLikes ?? optimisticLikes)
      },
      onSuccess: () => {
        // 更新用户点赞计数
        setUserLikes((prev) => {
          const newValue = prev + 1
          localStorage.setItem(`talk-${talkId}-likes`, String(newValue))
          return newValue
        })
        // 主动刷新数据
        queryClient.invalidateQueries({
          queryKey: trpc.talks.getAllTalks.queryKey(),
        })
      },
    }),
  )

  const handleLike = () => {
    if (!session || userLikes >= MAX_LIKES_PER_USER)
      return

    // 只触发一次 mutation
    incrementLike({ talkId })
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-all',
        session ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed',
        userLikes >= MAX_LIKES_PER_USER && 'opacity-50',
        className,
      )}
      onClick={handleLike}
    >
      <Heart
        className={cn(
          'h-3 w-3 transition-colors',
          userLikes > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400',
        )}
      />

      <div className="flex items-center gap-1">
        <NumberFlow
          willChange
          value={optimisticLikes}
          plugins={[continuous]}
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        />
        {userLikes > 0 && (
          <span className="text-xs text-gray-500">
            (+
            {Math.min(userLikes, MAX_LIKES_PER_USER)}
            )
          </span>
        )}
      </div>
    </div>
  )
}

export default LikeButton

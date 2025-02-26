'use client'
import NumberFlow from '@number-flow/react'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

interface LikeButtonProps {
  talkId: string
  initialLikes: number
  className?: string
}

const MAX_LIKES_PER_USER = 3

function LikeButton({ talkId, initialLikes, className }: LikeButtonProps) {
  const { data: session } = useSession()
  const utils = api.useUtils()
  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes)
  const [userLikes, setUserLikes] = useState(0)

  // 从 localStorage 初始化用户点赞次数
  useEffect(() => {
    const storedLikes = localStorage.getItem(`talk-${talkId}-likes`)
    setUserLikes(storedLikes ? Math.min(Number(storedLikes), MAX_LIKES_PER_USER) : 0)
  }, [talkId])

  // 实时数据订阅
  const { data: realtimeData } = api.talks.getAllTalks.useQuery(undefined, {
    select: data => data.items.find(t => t.id === talkId)?.likes,
  })

  // 点赞 mutation
  const { mutate: incrementLike } = api.talks.incrementLikes.useMutation({
    onMutate: async () => {
      await utils.talks.getAllTalks.cancel()
      const previousData = utils.talks.getAllTalks.getData()

      // 乐观更新
      utils.talks.getAllTalks.setData(undefined, (old) => {
        if (!old)
          return old
        return {
          ...old,
          items: old.items.map(talk =>
            talk.id === talkId
              ? { ...talk, likes: talk.likes + 1 }
              : talk,
          ),
        }
      })

      return { previousData }
    },
    onError: (_err, _, context) => {
      utils.talks.getAllTalks.setData(undefined, context?.previousData)
      setOptimisticLikes(prev => prev - 1)
    },
    onSuccess: () => {
      setUserLikes((prev) => {
        const newValue = prev + 1
        localStorage.setItem(`talk-${talkId}-likes`, String(newValue))
        return newValue
      })
    },
  })

  const handleLike = () => {
    if (!session || userLikes >= MAX_LIKES_PER_USER)
      return
    setOptimisticLikes(prev => prev + 1)
    incrementLike({ talkId })
  }

  // 计算显示值
  const displayLikes = realtimeData
    ? realtimeData + (userLikes >= MAX_LIKES_PER_USER ? 0 : userLikes)
    : optimisticLikes

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
      <Heart className={cn(
        'h-3 w-3 transition-colors',
        userLikes > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400',
      )}
      />

      <div className="flex items-center gap-1">
        <NumberFlow
          value={displayLikes}
          className="font-medium text-xs text-gray-900 dark:text-gray-100"
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

'use client'
import type { ContentType } from '~/types/content'
import NumberFlow, { continuous } from '@number-flow/react'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useContentLikeCount, useLikeContent } from '~/hooks/queries/like.query'
import { useSession } from '~/lib/auth-client'
import { cn } from '~/utils'

interface LikeButtonProps {
  talkId: string
  initialLikes: number
  className?: string
}

const MAX_LIKES_PER_USER = 3

function LikeButton({ talkId, initialLikes, className }: LikeButtonProps) {
  const { data: session } = useSession()
  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes)
  const [userLikes, setUserLikes] = useState(0)

  // 从 localStorage 初始化用户点赞次数
  useEffect(() => {
    const storedLikes = localStorage.getItem(`talk-${talkId}-likes`)
    setUserLikes(storedLikes ? Math.min(Number(storedLikes), MAX_LIKES_PER_USER) : 0)
  }, [talkId])
  const likeCountQuery = useContentLikeCount({ slug: talkId, contentType: 'talks' as ContentType })
  const { mutate: likeTalk } = useLikeContent({ slug: talkId, contentType: 'talks' as ContentType })

  useEffect(() => {
    if (likeCountQuery.status === 'success') {
      setOptimisticLikes(likeCountQuery.data.likes)
    }
  }, [likeCountQuery.status, likeCountQuery.data?.likes])

  const handleLike = () => {
    if (!session || userLikes >= MAX_LIKES_PER_USER)
      return

    // 只触发一次 mutation
    likeTalk({ slug: talkId, value: 1, contentType: 'talks' as ContentType })
    setOptimisticLikes(prev => prev + 1)
    setUserLikes((prev) => {
      const newValue = prev + 1
      localStorage.setItem(`talk-${talkId}-likes`, String(newValue))
      return newValue
    })
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

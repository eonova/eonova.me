import { MessageSquare, Podcast, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/base/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/base/card'
import { Skeleton } from '~/components/base/skeleton'
import { getAvatarAbbreviation, getDefaultImage } from '~/utils'
import { formatDate } from '~/utils/format-date'

interface ActivityItem {
  id: string
  type: 'comment' | 'talk' | 'user'
  content: string
  createdAt: Date
  user: {
    name: string
    image: string | null
  } | null
}

interface RecentActivityProps {
  activities: ActivityItem[]
  loading?: boolean
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'comment':
      return MessageSquare
    case 'talk':
      return Podcast
    case 'user':
      return UserPlus
    default:
      return MessageSquare
  }
}

function getActivityColor(type: ActivityItem['type']) {
  switch (type) {
    case 'comment':
      return 'text-blue-500'
    case 'talk':
      return 'text-green-500'
    case 'user':
      return 'text-purple-500'
    default:
      return 'text-gray-500'
  }
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start space-x-3 p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">暂无活动记录</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近活动</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const iconColor = getActivityColor(activity.type)
          const defaultImage = activity.user?.name ? getDefaultImage(activity.id) : null

          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="relative">
                {activity.user
                  ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={activity.user.image ?? defaultImage ?? undefined}
                          alt={activity.user.name}
                        />
                        <AvatarFallback>{getAvatarAbbreviation(activity.user.name)}</AvatarFallback>
                      </Avatar>
                    )
                  : (
                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                    )}
                <div className="bg-background border-background absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2">
                  <Icon className={`h-2.5 w-2.5 ${iconColor}`} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground line-clamp-2 text-sm">{activity.content}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatDate(activity.createdAt.toISOString())}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

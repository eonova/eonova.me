'use client'

import { useQuery } from '@tanstack/react-query'
import { UsersIcon } from 'lucide-react'

import { RecentActivity } from '~/components/pages/admin/dashboard/recent-activity'
import { StatsCard } from '~/components/pages/admin/dashboard/stats-card'
import { useTRPC } from '~/trpc/client'

function Page() {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(trpc.admin.getDashboardStats.queryOptions())
  const { data: recentActivity } = useQuery(
    trpc.admin.getRecentActivity.queryOptions({
      limit: 10,
    }),
  )

  const stats = [
    {
      title: 'Total Users',
      value: data?.totalUsers,
      change: data?.recentUsers,
    },
    {
      title: 'Total Comments',
      value: data?.totalComments,
      change: data?.recentComments,
    },
    {
      title: 'Total Talks',
      value: data?.totalTalks,
      change: data?.recentTalks,
    },
    {
      title: 'Total Album Images',
      value: data?.totalAlbumImages,
      change: 0,
    },
    {
      title: 'Total Friends',
      value: data?.totalFriends,
      change: 0,
    },
    {
      title: 'Total Guestbook',
      value: data?.totalGuestbook,
      change: 0,
    },
    {
      title: 'Recent Users',
      value: data?.recentUsers,
      change: 0,
    },
    {
      title: 'Recent Comments',
      value: data?.recentComments,
      change: 0,
    },
    {
      title: 'Recent Talks',
      value: data?.recentTalks,
      change: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Blog 管理面板</h1>
      <RecentActivity activities={recentActivity ?? []} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="col-span-1">
            <StatsCard title="Total Users" value={1000} icon={UsersIcon} loading />
          </div>
        )}
        {isError && (
          <div className="col-span-1">
            <StatsCard title="Total Users" value={1000} icon={UsersIcon} loading />
          </div>
        )}
        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value ?? 0}
                change={stat.change}
                changeLabel="Last 7 days"
                icon={UsersIcon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page

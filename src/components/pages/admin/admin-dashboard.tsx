'use client'

import { BookOpenIcon, Eye, Github, Heart, ImageIcon, LinkIcon, MessageSquareIcon, MicIcon, UsersIcon, Youtube } from 'lucide-react'

import { useDashboardStats, useRecentActivity } from '~/hooks/queries/admin.query'
import { useGitHubStat, useNoteLikeStat, useNoteViewStat, usePostLikeStat, usePostViewStat, useTalkLikeStat, useTalkViewStat, useYouTubeStat } from '~/hooks/queries/stat.query'
import { RecentActivity } from './dashboard/recent-activity'
import { StatsCard } from './dashboard/stats-card'

function AdminDashboard() {
  const { data, isLoading, isError } = useDashboardStats()
  const { data: recentActivity, isLoading: isRecentActivityLoading } = useRecentActivity()
  const { data: youtubeStats } = useYouTubeStat()
  const { data: githubStats } = useGitHubStat()
  const { data: postLikeStats } = usePostLikeStat()
  const { data: postViewStats } = usePostViewStat()
  const { data: noteLikeStats } = useNoteLikeStat()
  const { data: noteViewStats } = useNoteViewStat()
  const { data: talkLikeStats } = useTalkLikeStat()
  const { data: talkViewStats } = useTalkViewStat()

  const overviewStats = [
    {
      title: 'Total Users',
      value: data?.totalUsers,
      change: data?.recentUsers,
      icon: UsersIcon,
    },
    {
      title: 'Total Friends',
      value: data?.totalFriends,
      change: 0,
      icon: LinkIcon,
    },
    {
      title: 'Total Guestbook',
      value: data?.totalGuestbook,
      change: 0,
      icon: BookOpenIcon,
    },
    {
      title: 'Total Comments',
      value: data?.totalComments,
      change: data?.recentComments,
      icon: MessageSquareIcon,
    },
  ]

  const contentStats = [
    {
      title: 'Total Talks',
      value: data?.totalTalks,
      change: data?.recentTalks,
      icon: MicIcon,
    },
    {
      title: 'Talk Likes',
      value: talkLikeStats?.likes,
      change: 0,
      icon: Heart,
    },
    {
      title: 'Talk Views',
      value: talkViewStats?.views,
      change: 0,
      icon: Eye,
    },
    {
      title: 'Total Album Images',
      value: data?.totalAlbumImages,
      change: 0,
      icon: ImageIcon,
    },
    {
      title: 'Post Likes',
      value: postLikeStats?.likes,
      change: 0,
      icon: Heart,
    },
    {
      title: 'Post Views',
      value: postViewStats?.views,
      change: 0,
      icon: Eye,
    },
    {
      title: 'Note Likes',
      value: noteLikeStats?.likes,
      change: 0,
      icon: Heart,
    },
    {
      title: 'Note Views',
      value: noteViewStats?.views,
      change: 0,
      icon: Eye,
    },
  ]

  const externalStats = [
    {
      title: 'YouTube Subscribers',
      value: youtubeStats?.subscribers,
      change: 0,
      icon: Youtube,
    },
    {
      title: 'GitHub Stars',
      value: githubStats?.stars,
      change: 0,
      icon: Github,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatsCard key={i} title="Loading..." value={0} icon={UsersIcon} loading />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading stats
      </div>
    )
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full flex-1 p-6">
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Overview Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map(stat => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value ?? 0}
                change={stat.change}
                changeLabel="Last 7 days"
                icon={stat.icon}
              />
            ))}
          </div>
        </section>

        {/* Content & Engagement Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Content & Engagement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentStats.map(stat => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value ?? 0}
                change={stat.change}
                changeLabel="Last 7 days"
                icon={stat.icon}
              />
            ))}
          </div>
        </section>

        {/* External Platforms Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">External Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {externalStats.map(stat => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value ?? 0}
                change={stat.change}
                changeLabel="Last 7 days"
                icon={stat.icon}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="w-full xl:w-80 shrink-0">
        <RecentActivity activities={recentActivity ?? []} loading={isRecentActivityLoading} />
      </div>
    </div>
  )
}

export default AdminDashboard

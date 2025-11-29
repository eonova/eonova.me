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

  const stats = [
    {
      title: 'Total Users',
      value: data?.totalUsers,
      change: data?.recentUsers,
      icon: UsersIcon,
    },
    {
      title: 'Total Comments',
      value: data?.totalComments,
      change: data?.recentComments,
      icon: MessageSquareIcon,
    },
    {
      title: 'Total Talks',
      value: data?.totalTalks,
      change: data?.recentTalks,
      icon: MicIcon,
    },
    {
      title: 'Total Album Images',
      value: data?.totalAlbumImages,
      change: 0,
      icon: ImageIcon,
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
  ]

  return (
    <div className="flex gap-5 w-full h-full flex-1">
      <RecentActivity className="min-w-80 max-w-90" activities={recentActivity ?? []} loading={isRecentActivityLoading} />
      <div className="flex-1 grid gap-6">
        {isLoading && (
          <div className="col-span-1">
            <StatsCard title="Loading..." value={0} icon={UsersIcon} loading />
          </div>
        )}
        {isError && (
          <div className="col-span-1">
            <div>Error loading stats</div>
          </div>
        )}
        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map(stat => (
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
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

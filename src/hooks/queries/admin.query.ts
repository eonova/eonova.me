import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useDashboardStats() {
  return useQuery(orpc.admin.stats.dashboard.queryOptions())
}

export function useRecentActivity(limit: number = 10) {
  return useQuery(
    orpc.admin.stats.recentActivity.queryOptions({
      limit,
    }),
  )
}

export function useAdminComments() {
  return useQuery(orpc.admin.comments.list.queryOptions({ placeholderData: keepPreviousData }))
}

export function useAdminFriends() {
  return useQuery(orpc.admin.friends.list.queryOptions({ placeholderData: keepPreviousData }))
}

export function useAdminTalks() {
  return useQuery(orpc.admin.talks.list.queryOptions({ placeholderData: keepPreviousData }))
}

export function useAdminUsers() {
  return useQuery(orpc.admin.users.list.queryOptions({ placeholderData: keepPreviousData }))
}

export function useAdminAlbum() {
  return useQuery(orpc.admin.album.list.queryOptions({ placeholderData: keepPreviousData }))
}

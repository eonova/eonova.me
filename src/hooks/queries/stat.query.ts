import { useQuery } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useYouTubeStat() {
  return useQuery(orpc.stats.youtube.queryOptions())
}

export function useGitHubStat() {
  return useQuery(orpc.stats.github.queryOptions())
}

export function usePostLikeStat() {
  return useQuery(orpc.stats.posts.likes.queryOptions())
}

export function usePostViewStat() {
  return useQuery(orpc.stats.posts.views.queryOptions())
}

export function useNoteLikeStat() {
  return useQuery(orpc.stats.notes.likes.queryOptions())
}

export function useNoteViewStat() {
  return useQuery(orpc.stats.notes.views.queryOptions())
}

export function useTalkLikeStat() {
  return useQuery(orpc.stats.talks.likes.queryOptions())
}

export function useTalkViewStat() {
  return useQuery(orpc.stats.talks.views.queryOptions())
}

export function useWakatimeStat() {
  return useQuery(orpc.stats.wakatime.queryOptions())
}

export function useSpotifyStat() {
  return useQuery(orpc.stats.spotify.queryOptions())
}

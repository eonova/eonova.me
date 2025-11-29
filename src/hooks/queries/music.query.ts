import { useQuery } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function usePlaylistSongs() {
  return useQuery(orpc.music.list.queryOptions())
}

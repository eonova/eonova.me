import { useQuery } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

export function usePost(slug: string) {
  return useQuery(orpc.posts.bySlug.queryOptions({ input: { slug } }))
}

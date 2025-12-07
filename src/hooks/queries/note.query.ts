import { useQuery } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

export function useNote(slug: string) {
  return useQuery(orpc.notes.bySlug.queryOptions({ input: { slug } }))
}

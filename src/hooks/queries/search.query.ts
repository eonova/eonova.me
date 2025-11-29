import type { Inputs } from '~/orpc/client'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

export function useSearchResults(input: Inputs['search']['searchContent'], enabled = true) {
  return useQuery(orpc.search.searchContent.queryOptions({ input, enabled }))
}

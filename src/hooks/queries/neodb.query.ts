import type { Inputs } from '~/orpc/client'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

export function useNeoDBShelf(input: (pageParam: number | undefined) => Inputs['neodb']['list'], enabled = true) {
  return useInfiniteQuery(
    orpc.neodb.list.infiniteOptions({
      input,
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      enabled,
    }),
  )
}

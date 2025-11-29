import { keepPreviousData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useTalks() {
  return useInfiniteQuery(
    orpc.talks.list.infiniteOptions({
      input: (pageParam: Date | undefined) => ({ cursor: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: lastPage => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }),
  )
}

export function useCreateTalk(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.talks.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.talks.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteTalk(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.talks.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.talks.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useUpdateTalk(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.talks.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.talks.list.key() })
        onSuccess?.()
      },
    }),
  )
}

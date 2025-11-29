import { keepPreviousData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useFriends() {
  return useInfiniteQuery(
    orpc.friends.listAllFriends.infiniteOptions({
      input: (pageParam: Date | undefined) => ({ cursor: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: lastPage => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }),
  )
}

export function useCreateFriend(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.friends.createFriend.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.friends.listAllFriends.key() })
        qc.invalidateQueries({ queryKey: orpc.admin.friends.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteFriend(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.friends.deleteFriend.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.friends.listAllFriends.key() })
        qc.invalidateQueries({ queryKey: orpc.admin.friends.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useUpdateFriend(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.friends.updateFriend.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.friends.listAllFriends.key() })
        qc.invalidateQueries({ queryKey: orpc.admin.friends.list.key() })
        onSuccess?.()
      },
    }),
  )
}

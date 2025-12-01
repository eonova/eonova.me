import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useSettings() {
  return useQuery({
    ...orpc.settings.get.queryOptions(),
    retry: false, // Don't retry if failed (e.g. not logged in)
  })
}

export function useUpdateSettings(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.settings.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.settings.get.key() })
        onSuccess?.()
      },
    }),
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useAlbumImages() {
  return useQuery(orpc.album.listAllImages.queryOptions())
}

export function useAddAlbumImage(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.admin.album.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.album.listAllImages.key() })
        qc.invalidateQueries({ queryKey: orpc.admin.album.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteAlbumImage(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.admin.album.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.album.listAllImages.key() })
        qc.invalidateQueries({ queryKey: orpc.admin.album.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useUpdateAlbumImage(onSuccess?: () => void) {
  const qc = useQueryClient()
  return useMutation(
    orpc.admin.album.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.album.listAllImages.key() })
        qc.invalidateQueries({ queryKey: orpc.admin.album.list.key() })
        onSuccess?.()
      },
    }),
  )
}

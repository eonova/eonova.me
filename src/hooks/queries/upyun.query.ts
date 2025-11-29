import { useMutation } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useUpyunUpload(options?: {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  onSettled?: () => void
}) {
  return useMutation(orpc.upyun.upload.mutationOptions(options))
}

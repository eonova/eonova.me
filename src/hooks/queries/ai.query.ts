import { useMutation } from '@tanstack/react-query'

import { orpc } from '~/orpc/client'

export function useGenerateSummary() {
  return useMutation(orpc.ai.generate.mutationOptions())
}

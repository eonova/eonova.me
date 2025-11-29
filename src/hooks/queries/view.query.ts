import type { Inputs } from '~/orpc/client'
import type { ContentType } from '~/types/content'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

export function useContentViewCount(input: Inputs[ContentType]['views']['count']) {
  return useQuery(orpc[input.contentType!].views.count.queryOptions({ input: { slug: input.slug, contentType: input.contentType! } }))
}

export function useIncrementContentViewCount(input: Inputs[ContentType]['views']['count']) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc[input.contentType!].views.increment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc[input.contentType!].views.count.key({ input: { slug: input.slug, contentType: input.contentType! } }),
        })
      },
    }),
  )
}

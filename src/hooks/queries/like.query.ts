import type { Inputs, Outputs } from '~/orpc/client'

import type { ContentType } from '~/types/content'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

type ContentLikeCountOutput = Outputs[ContentType]['likes']['count']

export function useContentLikeCount(input: Inputs[ContentType]['likes']['count']) {
  return useQuery(orpc[input.contentType!].likes.count.queryOptions({ input: { slug: input.slug, contentType: input.contentType! } }))
}

export function useLikeContent(input: Inputs[ContentType]['likes']['count']) {
  const queryClient = useQueryClient()
  const queryKey = orpc[input.contentType!].likes.count.queryKey({ input: { slug: input.slug, contentType: input.contentType! } })

  return useMutation(
    orpc[input.contentType!].likes.increment.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData<ContentLikeCountOutput>(queryKey)
        if (previousData) {
          queryClient.setQueryData<ContentLikeCountOutput>(queryKey, {
            ...previousData,
            likes: previousData.likes + newData.value,
            currentUserLikes: previousData.currentUserLikes + newData.value,
          })
        }

        return { previousData }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: orpc[input.contentType!].likes.count.key({ input: { slug: input.slug, contentType: input.contentType! } }) })
      },
    }),
  )
}

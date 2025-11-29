import type { Inputs } from '~/orpc/client'
import type { ContentType } from '~/types/content'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orpc } from '~/orpc/client'

export function useListComments(input: (pageParam: Date | undefined) => Inputs[ContentType]['comments']['list'], contentType: ContentType, enabled = true) {
  return useInfiniteQuery(
    orpc[contentType].comments.list.infiniteOptions({
      input,
      initialPageParam: undefined,
      getNextPageParam: lastPage => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      enabled,
    }),
  )
}
export function useContentCommentCount(input: Inputs[ContentType]['comments']['count'], contentType: ContentType) {
  return useQuery(orpc[contentType].comments.count.queryOptions({ input }))
}

export function useReplyCount(input: Inputs[ContentType]['replies']['count'], contentType: ContentType) {
  return useQuery(orpc[contentType].replies.count.queryOptions({ input }))
}

export function useVoteContentComment(input: Inputs[ContentType]['comments']['list'], contentType: ContentType) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc[contentType].votes.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc[contentType].comments.list.key({ input }) })
      },
    }),
  )
}

export function useCreateContentComment(input: Inputs[ContentType]['comments']['list'], contentType: ContentType, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc[contentType].comments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc[contentType].comments.list.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc[contentType].comments.count.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc[contentType].replies.count.key({ input }) })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteContentComment(input: Inputs[ContentType]['comments']['list'], contentType: ContentType, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc[contentType].comments.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc[contentType].comments.list.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc[contentType].comments.count.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc[contentType].replies.count.key({ input }) })
        onSuccess?.()
      },
    }),
  )
}

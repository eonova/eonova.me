import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import { SuperJSON } from 'superjson'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分钟
        gcTime: 10 * 60 * 1000, // 10分钟垃圾回收
        retry: (failureCount, error: any) => {
          // 对于某些错误不重试
          if (error?.data?.code === 'UNAUTHORIZED' || error?.data?.code === 'FORBIDDEN') {
            return false
          }
          return failureCount < 3
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  })
}

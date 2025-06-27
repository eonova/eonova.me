'use client'

import type { QueryClient } from '@tanstack/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import type { AppRouter } from './root'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { useState } from 'react'
import { SuperJSON } from 'superjson'
import { getBaseUrl } from '~/utils/get-base-url'

import { makeQueryClient } from './query-client'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

let browserQueryClient: QueryClient | undefined

function getTRPCBaseUrl() {
  if (typeof globalThis !== 'undefined')
    return ''
  return getBaseUrl()
}

function getQueryClient() {
  if (typeof globalThis === 'undefined') {
    return makeQueryClient()
  }

  browserQueryClient ??= makeQueryClient()

  return browserQueryClient
}

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>

interface TRPCReactProviderProps {
  children: React.ReactNode
}

export function TRPCReactProvider(props: TRPCReactProviderProps) {
  const { children } = props
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development'
            || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          transformer: SuperJSON,
          url: `${getTRPCBaseUrl()}/api/trpc`,
          // 批处理配置
          maxURLLength: 2048,
          // 请求头优化
          headers: () => ({
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
          }),
          // 请求超时
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              signal: AbortSignal.timeout(30000), // 30秒超时
            })
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

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
import { env } from '~/lib/env'

import { makeQueryClient } from './query-client'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

let browserQueryClient: QueryClient | undefined

function getBaseUrl() {
  if (typeof globalThis !== 'undefined')
    return ''
  if (env.VERCEL_URL)
    return `https://${env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
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
        httpBatchLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
        }),
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development'
            || (opts.direction === 'down' && opts.result instanceof Error),
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

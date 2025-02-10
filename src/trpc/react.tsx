'use client'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from './root'

import { QueryNormalizerProvider } from '@normy/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useState } from 'react'
import { SuperJSON } from 'superjson'
import { env } from '~/lib/env'

const createQueryClient = () => new QueryClient()

let clientQueryClientSingleton: QueryClient | undefined

function getBaseUrl() {
  if (typeof globalThis !== 'undefined')
    return ''
  if (env.VERCEL_URL)
    return `https://${env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

function getQueryClient() {
  if (typeof globalThis === 'undefined') {
    return createQueryClient()
  }

  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = createQueryClient()
  }

  return clientQueryClientSingleton
}

export const api = createTRPCReact<AppRouter>()

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>

interface TRPCReactProviderProps {
  children: React.ReactNode
}

export function TRPCReactProvider(props: TRPCReactProviderProps) {
  const { children } = props
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: op =>
            process.env.NODE_ENV === 'development'
            || (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
          headers: { 'x-trpc-source': 'nextjs-react' },
        }),
      ],
    }),
  )

  return (
    <QueryNormalizerProvider queryClient={queryClient} normalizerConfig={{ devLogging: true }}>
      {/* eslint-disable-next-line @eslint-react/no-context-provider -- custom context */}
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryStreamedHydration transformer={SuperJSON}>
            {children}
          </ReactQueryStreamedHydration>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </api.Provider>
    </QueryNormalizerProvider>
  )
}

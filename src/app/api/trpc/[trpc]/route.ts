import type { NextRequest } from 'next/server'

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createTRPCContext } from '~/trpc/init'
import { appRouter } from '~/trpc/root'

async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
          }
        : undefined,
  })
}

export { handler as GET, handler as POST }

import { PostHog } from 'posthog-node'

import { env } from '~/lib/env'

let posthogInstance: PostHog | null = null

export function getPostHogServer() {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    throw new Error('POSTHOG_KEY is not set')
  }

  posthogInstance ??= new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })

  return posthogInstance
}

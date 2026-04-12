'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const isProd = process.env.NODE_ENV === 'production'
    if (!key || !isProd)
      return
    posthog.init(key, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: false,
    })
  }, [])
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

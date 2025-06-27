import { env } from '~/lib/env'

export function getBaseUrl() {
  const base = env.NEXT_PUBLIC_SITE_URL ?? env.VERCEL_URL
  if (base) {
    return `https://${base}`
  }
  return `http://localhost:${process.env.PORT ?? 3000}`
}

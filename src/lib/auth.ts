import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'
import { db } from '~/db'
import { getBaseUrl } from '~/utils/get-base-url'
import { env } from './env'

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  trustedOrigins: [getBaseUrl()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: { type: 'string', required: true, input: false, defaultValue: 'user' },
    },
  },
})

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

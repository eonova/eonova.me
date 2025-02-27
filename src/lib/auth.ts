import type { DefaultSession, NextAuthConfig, NextAuthResult } from 'next-auth'
import type { InferSelectModel } from '../db'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { cache } from 'react'
import { getDefaultUser } from '~/utils'
import { accounts, db, eq, sessions, users, verificationTokens } from '../db'

import { env } from './env'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email: string
      image?: string | null
      role: InferSelectModel<typeof users>['role']
    } & DefaultSession['user']
  }

  interface User {
    role: InferSelectModel<typeof users>['role']
  }
}

const config: NextAuthConfig = {
  secret: env.AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  callbacks: {
    async signIn({ account, profile, user }) {
      try {
        // Update data when user signs in every time
        if (account?.provider === 'google') {
          if (!profile)
            return true

          await db
            .update(users)
            .set({
              name: profile.name,
              image: profile.picture,
            })
            .where(eq(users.id, user.id!))
        }

        if (account?.provider === 'github') {
          if (!profile)
            return true

          await db
            .update(users)
            .set({
              name: profile.name,
              image: profile.avatar_url as string,
            })
            .where(eq(users.id, user.id!))
        }
        return true
      }
      catch (error) {
        console.log('AUTH CALLBACK ERROR:', error)
        return false
      }
    },
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
        },
      }
    },
  },
}

export const {
  handlers: { GET, POST },
  auth,
}: NextAuthResult = NextAuth(config)

export const getCurrentUser = cache(async () => {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const { defaultImage, defaultName } = getDefaultUser(session.user.id)

  return {
    ...session.user,
    name: session.user.name ?? defaultName,
    image: session.user.image ?? defaultImage,
  }
})

export type User = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>

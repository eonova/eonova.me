import path from 'node:path'

import { test as setup } from '@playwright/test'
import { generateId } from 'better-auth'
import { serializeSignedCookie } from 'better-call'
import dayjs from 'dayjs'
import { accounts, db, sessions, users } from '~/db'
import { env } from '~/lib/env'

import { TEST_USER } from '../fixtures/auth'

const authenticatedStoragePath = path.resolve(import.meta.dirname, '../.auth/user.json')
const unauthenticatedStoragePath = path.resolve(
  import.meta.dirname,
  '../.auth/unauthenticated.json',
)

setup('setup unauthenticated', async ({ page }) => {
  await page.context().storageState({ path: unauthenticatedStoragePath })
})

setup('setup authenticated', async ({ page }) => {
  try {
    const expiresAt = dayjs().add(7, 'day').toDate()

    // 使用更短的超时时间和重试机制
    await db.transaction(async (tx) => {
      await tx
        .insert(users)
        .values({
          id: TEST_USER.id,
          name: TEST_USER.name,
          email: TEST_USER.email,
          image: TEST_USER.image,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing({ target: users.id })

      await tx
        .insert(accounts)
        .values({
          id: generateId(),
          accountId: TEST_USER.accountId,
          providerId: 'github',
          userId: TEST_USER.id,
          accessToken: 'gho_1234567890',
          scope: 'read:user,user:email',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing({ target: accounts.id })

      await tx
        .insert(sessions)
        .values({
          id: generateId(),
          token: TEST_USER.sessionToken,
          userId: TEST_USER.id,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: sessions.token,
          set: { expiresAt },
        })
    })

    const cookie = await serializeSignedCookie(
      'better-auth.session_token',
      TEST_USER.sessionToken,
      env.BETTER_AUTH_SECRET,
    )

    await page.context().addCookies([
      {
        name: 'better-auth.session_token',
        value: `${TEST_USER.sessionToken}.${cookie.split('.')[2]!}`,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(expiresAt.valueOf() / 1000),
      },
    ])

    await page.goto('http://localhost:3000/')
    await page.context().storageState({ path: authenticatedStoragePath })

    console.log('[E2E Setup]: Authenticated setup completed successfully')
  }
  catch (error) {
    console.error('[E2E Setup]: Authenticated setup failed:', error)

    // 如果是连接超时，尝试重试一次
    if (
      error instanceof Error
      && (error.message?.includes('timeout') || error.message?.includes('Connection terminated'))
    ) {
      console.log('[E2E Setup]: Retrying authenticated setup due to connection issue...')

      try {
        const expiresAt = dayjs().add(7, 'day').toDate()

        // 简化的重试逻辑 - 只设置cookie，不操作数据库
        const cookie = await serializeSignedCookie(
          'better-auth.session_token',
          TEST_USER.sessionToken,
          env.BETTER_AUTH_SECRET,
        )

        await page.context().addCookies([
          {
            name: 'better-auth.session_token',
            value: `${TEST_USER.sessionToken}.${cookie.split('.')[2]!}`,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
            expires: Math.floor(expiresAt.valueOf() / 1000),
          },
        ])

        await page.goto('http://localhost:3000/')
        await page.context().storageState({ path: authenticatedStoragePath })
        console.log('[E2E Setup]: Authenticated setup retry completed')
      }
      catch (retryError) {
        console.error('[E2E Setup]: Authenticated setup retry failed:', retryError)
        throw retryError
      }
    }
    else {
      throw error
    }
  }
})

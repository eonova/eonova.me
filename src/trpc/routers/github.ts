import { Octokit } from '@octokit/rest'
import { TRPCError } from '@trpc/server'
import { GITHUB_USERNAME } from '~/config/constants'

import { env } from '~/lib/env'
import { ratelimit } from '~/lib/kv'

import { getIp } from '~/utils'
import { createTRPCRouter, publicProcedure } from '../trpc'

const getKey = (id: string) => `github:${id}`

export const githubRouter = createTRPCRouter({
  // 获取用户信息和仓库星星总数
  get: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    const octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
    })

    const { data: repos } = await octokit.request('GET /users/{username}/repos', {
      username: GITHUB_USERNAME,
    })

    const { data: user } = await octokit.request('GET /users/{username}', {
      username: GITHUB_USERNAME,
    })

    const stars = repos
      .filter((repo) => {
        return !repo.fork
      })
      .reduce((acc, repo) => {
        return acc + (repo.stargazers_count ?? 0)
      }, 0)

    const followers = user.followers

    return {
      stars,
      followers,
    }
  }),

  // 获取指定仓库的星星数
  getRepoStars: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    const octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
    })

    const { data: repos } = await octokit.request('GET /users/{username}/repos', {
      username: GITHUB_USERNAME,
    })

    return repos.find(repo => repo.name === 'leostar.top')?.stargazers_count ?? 0
  }),
})

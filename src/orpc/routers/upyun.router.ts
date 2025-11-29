import { Buffer } from 'node:buffer'
import { ORPCError } from '@orpc/client'
import { env } from '~/lib/env'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils/get-ip'
import { publicProcedure } from '../root'
import { uploadInputSchema } from '../schemas/upyun.schema'

// UPYUN 配置（从环境变量获取）
const UPYUN_OPERATOR = env.UPYUN_OPERATOR // UPYUN 操作员名
const UPYUN_PASSWORD = env.UPYUN_PASSWORD // UPYUN 操作员密码
const UPYUN_BUCKET = env.UPYUN_BUCKET // UPYUN 存储空间名

// 获取 UPYUN 认证头信息
function getUpyunAuthHeader() {
  const authString = `${UPYUN_OPERATOR}:${UPYUN_PASSWORD}`

  return `Basic ${Buffer.from(authString).toString('base64')}`
}

const getKey = (id: string) => `upyun:${id}`

export const upload = publicProcedure
  .input(uploadInputSchema)
  .handler(async ({ context, input }) => {
    const ip = getIp(context.headers)
    const { success } = await ratelimit.limit(getKey(ip))
    if (!success) {
      throw new ORPCError('TOO_MANY_REQUESTS', { message: '请求过于频繁，请稍后再试' })
    }

    const { file, path, filename, mimetype } = input
    if (!file || !path || !filename || !mimetype) {
      throw new ORPCError('BAD_REQUEST', { message: '缺少参数' })
    }

    try {
      const buffer = Buffer.from(file, 'base64')
      const endpoint = `https://v0.api.upyun.com/${UPYUN_BUCKET}/${path}`
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': getUpyunAuthHeader(),
          'Content-Type': mimetype,
        },
        body: buffer,
      })
      if (!response.ok) {
        const text = await response.text()
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: `UPYUN 上传失败: ${text ?? response.statusText}`,
        })
      }
      const url = `https://${UPYUN_BUCKET}.test.upcdn.net/${path}`
      return {
        success: true,
        url,
        path,
        size: buffer.length,
      }
    }
    catch (error) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', { message: error instanceof Error ? error.message : '未知错误' })
    }
  })

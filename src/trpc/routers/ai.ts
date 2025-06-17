import OpenAI from 'openai'
import { z } from 'zod'
import { eq, posts } from '~/db'
import { env } from '~/lib/env'
import { extractPlainTextFromMarkdown } from '~/utils/removeuseless'
import { createTRPCRouter, publicProcedure } from '../init'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: env.DEEPSEEK_API_KEY,
})

export const aiRouter = createTRPCRouter({
  generate: publicProcedure
    .input(z.object({
      content: z.string().min(50),
      slug: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // 获取当前文章存储
        const result = await ctx.db.query.posts.findFirst({
          where: eq(posts.slug, input.slug),
        })
        const isExpired = result?.summary
          && result?.updatedAt
          && new Date(result.updatedAt).getTime() + 24 * 60 * 60 * 1000 < Date.now()
        if (result?.summary && !isExpired) {
          return { summary: extractPlainTextFromMarkdown(result.summary) }
        }
        const completion = await openai.chat.completions.create({
          messages: [{ role: 'system', content: '你是一个简洁的摘要生成器，你只需要回复一段话' }, { role: 'user', content: input.content }],
          model: 'deepseek-chat',
        })
        const data = completion.choices[0]?.message.content
        // 缓存到数据库
        await ctx.db.update(posts).set({ summary: String(data), updatedAt: new Date() }).where(eq(posts.slug, input.slug))
        return { summary: extractPlainTextFromMarkdown(data!) }
      }
      catch (error) {
        throw new Error('摘要生成失败', { cause: error })
      }
    }),
})

import { deepseek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'
import { eq, notes, posts } from '~/db'
import { extractPlainTextFromMarkdown } from '~/utils/remove-useless'
import { publicProcedure } from '../root'
import { AIAbstractInputSchema } from '../schemas/ai.schema'

export const generate = publicProcedure
  .input(AIAbstractInputSchema)
  .handler(async ({ context, input }) => {
    try {
      let result
      const isPost = input.type === 'post'

      if (isPost) {
        result = await context.db.query.posts.findFirst({
          where: eq(posts.slug, input.slug),
        })
      }
      else {
        result = await context.db.query.notes.findFirst({
          where: eq(notes.title, input.slug),
        })
      }

      const isExpired
        = result?.summary
          && result?.updatedAt
          && new Date(result.updatedAt).getTime() + 24 * 60 * 60 * 1000 < Date.now()

      if (result?.summary && !isExpired) {
        return { summary: extractPlainTextFromMarkdown(result.summary) }
      }

      const { text } = await generateText({
        model: deepseek('deepseek-chat'),
        system: '你是一个简洁的摘要生成器，你只需要回复一段话',
        prompt: input.content,
      })

      if (isPost) {
        await context.db
          .update(posts)
          .set({ summary: String(text), updatedAt: new Date() })
          .where(eq(posts.slug, input.slug))
      }
      else {
        await context.db
          .update(notes)
          .set({ summary: String(text), updatedAt: new Date() })
          .where(eq(notes.title, input.slug))
      }

      return { summary: extractPlainTextFromMarkdown(text) }
    }
    catch (error) {
      throw new Error('摘要生成失败', { cause: error })
    }
  })

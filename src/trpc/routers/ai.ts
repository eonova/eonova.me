import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const aiRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(z.object({ content: z.string().min(50) }))
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          'https://api.deepseek.com/v1/summarize',
          {
            method: 'POST',
            body: JSON.stringify({
              text: input.content,
              max_length: 150,
            }),
            headers: {
              'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        )
        const data = await response.json()
        return { summary: data.summary }
      }
      catch (error) {
        throw new Error('摘要生成失败', { cause: error })
      }
    }),
})

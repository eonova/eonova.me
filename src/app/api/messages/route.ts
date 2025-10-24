import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '~/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 验证API密钥
  const apiKey = req.headers['x-api-key']
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { message } = req.body

    // 发送广播消息
    const channel = supabase.channel('broadcast-channel')
    const response = await channel.send({
      type: 'broadcast',
      event: 'new-message',
      payload: {
        content: message,
        timestamp: Date.now(),
      },
    })

    if (response === 'ok') {
      return res.status(200).json({ success: true })
    }

    return res.status(500).json({ error: 'Broadcast failed' })
  }
  catch (error) {
    console.error('广播错误:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

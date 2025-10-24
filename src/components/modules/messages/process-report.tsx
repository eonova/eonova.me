'use client'
import { useEffect, useState } from 'react'
import { supabase } from '~/lib/supabase'

export default function MessageReceiver() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    // 创建Supabase频道
    const channel = supabase.channel('broadcast-channel')

    // 订阅广播消息
    channel.on(
      'broadcast',
      { event: 'new-message' },
      (payload) => {
        const { content } = payload.payload
        setMessages(prev => [...prev, content])
      },
    ).subscribe()

    // 添加错误处理
    channel.on('broadcast', { event: 'error' }, (payload) => {
      console.error('广播错误:', payload)
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-2">实时消息</h2>
      <div className="h-64 overflow-y-auto border p-2">
        {messages.length > 0
          ? (
              <ul>
                {messages.map((msg, index) => (
                  <li key={index} className="py-1 border-b">
                    {msg}
                  </li>
                ))}
              </ul>
            )
          : (
              <p className="text-gray-500">等待消息中...</p>
            )}
      </div>
    </div>
  )
}

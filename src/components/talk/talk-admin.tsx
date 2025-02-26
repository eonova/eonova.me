'use client'
import { useState } from 'react'
import { api } from '~/trpc/react'
import { Button } from '../base/button'
import { Textarea } from '../base/textarea'
import { toast } from '../base/toaster'
import TalkBox from './box'

interface TalkAdminProps {
  // 可添加 props 如初始数据等
}

const TalkAdmin: React.FC<TalkAdminProps> = () => {
  const [talkText, setTalkText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 初始化 tRPC 创建动态的 mutation
  const { mutate: createTalk } = api.talks.createTalk.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: () => {
      toast.success('动态发布成功!')
      setTalkText('')
    },
    onError: (error) => {
      toast.error(`动态发布失败${error.data}`)
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 客户端验证
    if (!talkText.trim()) {
      return
    }

    // 调用 API
    createTalk({
      content: talkText,
    })
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5 w-full flex-1">
      <form className="font-world flex flex-col gap-5" onSubmit={handleSubmit}>
        <h3>表达你的想法💡：</h3>
        <div className="flex flex-col gap-2">
          <Textarea
            value={talkText}
            onChange={e => setTalkText(e.target.value)}
          />

          <div className="w-full flex justify-end gap-3">
            <Button
              type="button"
              variant="destructive"
              className="w-15"
              onClick={() => setTalkText('')}
            >
              重置
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="w-15"
              disabled={isLoading}
            >
              {isLoading ? '发送中...' : '发送'}
            </Button>
          </div>
        </div>

        <div className="bg-gray-200/20 dark:bg-gray-200/10 rounded-xl p-5 text-xs flex-1">
          <h4 className="font-bold mb-2">发布规则：</h4>
          <ul className="space-y-1">
            <li>1. 内容需符合社区规范</li>
            <li>2. 禁止发布广告信息</li>
            <li>3. 每5分钟限发1条动态</li>
          </ul>
        </div>
      </form>

      <div className="flex flex-col gap-5">
        <h3 className="font-sans">预览区域：</h3>
        <div className="rounded-xl p-5 flex-1 border">
          {talkText
            ? (
                <TalkBox>
                  {talkText}
                </TalkBox>
              )
            : (
                <div className="text-gray-500 text-sm">
                  输入内容后预览将在此处显示
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

export default TalkAdmin

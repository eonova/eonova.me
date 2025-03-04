'use client'
import { useState } from 'react'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { Button } from '../base/button'
import { Textarea } from '../base/textarea'
import { toast } from '../base/toaster'
import TalkBox from './box'
import TalkMdx from './mdx'

interface TalkAdminProps {
  // 可添加 props 如初始数据等
}

const TalkAdmin: React.FC<TalkAdminProps> = () => {
  const [talkText, setTalkText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: talks } = api.talks.getAllTalks.useQuery()
  const utils = api.useUtils()

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
      utils.talks.getAllTalks.invalidate()
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

  // 拿到所有动态数据
  // 刪除动态
  const talkMutation = api.talks.deleteTalk.useMutation({
    onSuccess: () => {
      toast.success('删除成功')
    },
    onError: (error) => {
      toast.error(`删除失败${error.data}`)
    },
    onSettled: () => {
      utils.talks.getAllTalks.invalidate()
      setIsLoading(false)
    },
  })

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

        <div className="flex flex-col gap-5">
          <h3 className="font-sans">预览区域：</h3>
          <div className="rounded-xl p-5 pt-[-5] flex-1 border">
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

      </form>
      <div className="bg-gray-200/20 dark:bg-gray-200/10 rounded-xl flex flex-col gap-2 text-xs h-full max-h-[75vh] overflow-y-auto">
        {
          talks?.items?.map(talk => (
            <div key={talk.id} className="flex flex-col gap-2 p-2 ">
              <div
                className={cn(
                  'relative inline-block rounded-xl p-3 text-zinc-800 dark:text-zinc-200',
                  'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
                  ' overflow-auto',
                )}
              >
                <TalkMdx>
                  {talk.content}
                </TalkMdx>
              </div>
              <div className="flex justify-end gap-3">
                <Button onClick={() => talkMutation.mutate({ id: talk.id })} variant="destructive" className="w-15">
                  删除
                </Button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default TalkAdmin

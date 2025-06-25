'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { Textarea } from '~/components/base/textarea'
import { toast } from '~/components/base/toaster'
import TalkBox from '~/components/pages/talk/box'
import TalkMdx from '~/components/pages/talk/mdx'
import { useTRPC } from '~/trpc/client'
import { cn } from '~/utils'

interface TalkAdminProps {
  // 可添加 props 如初始数据等
}

const TalkAdmin: React.FC<TalkAdminProps> = () => {
  const [talkText, setTalkText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const trpc = useTRPC()
  const { data: talks } = useQuery(trpc.talks.getAllTalks.queryOptions())

  // 初始化 tRPC 创建动态的 mutation
  const { mutate: createTalk } = useMutation(
    trpc.talks.createTalk.mutationOptions({
      onMutate: () => {
        setIsLoading(true)
      },
      onSuccess: () => {
        toast.success('动态发布成功!')
        setTalkText('')
      },
      onError: (error: any) => {
        toast.error(`动态发布失败${error.data}`)
      },
      onSettled: () => {
        trpc.talks.getAllTalks.queryOptions()
        setIsLoading(false)
      },
    }),
  )

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
  const talkMutation = useMutation(
    trpc.talks.deleteTalk.mutationOptions({
      onSuccess: () => {
        toast.success('删除成功')
      },
      onError: (error: any) => {
        toast.error(`删除失败${error.data}`)
      },
      onSettled: () => {
        trpc.talks.getAllTalks.queryOptions()
        setIsLoading(false)
      },
    }),
  )

  return (
    <div className="grid w-full flex-1 gap-5 sm:grid-cols-2">
      <form className="font-world flex flex-col gap-5" onSubmit={handleSubmit}>
        <h3>表达你的想法💡：</h3>
        <div className="flex flex-col gap-2">
          <Textarea value={talkText} onChange={e => setTalkText(e.target.value)} />

          <div className="flex w-full justify-end gap-3">
            <Button
              type="button"
              variant="destructive"
              className="w-15"
              onClick={() => setTalkText('')}
            >
              重置
            </Button>
            <Button type="submit" variant="outline" className="w-15" disabled={isLoading}>
              {isLoading ? '发送中...' : '发送'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="font-sans">预览区域：</h3>
          <div className="flex-1 rounded-xl border p-5 pt-[-5]">
            {talkText
              ? (
                  <TalkBox>{talkText}</TalkBox>
                )
              : (
                  <div className="text-sm text-gray-500">输入内容后预览将在此处显示</div>
                )}
          </div>
        </div>
      </form>
      <div className="flex h-full max-h-[75vh] flex-col gap-2 overflow-y-auto rounded-xl bg-gray-200/20 text-xs dark:bg-gray-200/10">
        {talks?.items?.map(
          (talk: { id: string, content: string, createdAt: Date, likes: number }) => (
            <div key={talk.id} className="flex flex-col gap-2 p-2">
              <div
                className={cn(
                  'relative inline-block rounded-xl p-3 text-zinc-800 dark:text-zinc-200',
                  'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20 font-world',
                  'overflow-auto',
                )}
              >
                <TalkMdx>{talk.content}</TalkMdx>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => talkMutation.mutate({ id: talk.id })}
                  variant="destructive"
                  className="w-15"
                >
                  删除
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export default TalkAdmin

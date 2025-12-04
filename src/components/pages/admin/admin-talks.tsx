'use client'

import { useState } from 'react'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/base/dialog'
import { Textarea } from '~/components/base/textarea'
import TalkBox from '~/components/pages/talk/box'
import TalkMdx from '~/components/pages/talk/mdx'
import { useAdminTalks } from '~/hooks/queries/admin.query'
import { useCreateTalk, useDeleteTalk, useUpdateTalk } from '~/hooks/queries/talks.query'
import { cn } from '~/utils'

function AdminTalks() {
  const [talkText, setTalkText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading } = useAdminTalks()

  const resetForm = () => {
    setTalkText('')
    setEditingId(null)
  }

  const createTalk = useCreateTalk(resetForm)
  const updateTalk = useUpdateTalk(resetForm)
  const deleteTalk = useDeleteTalk(() => setDeleteId(null))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!talkText.trim())
      return

    if (editingId) {
      updateTalk.mutate({ id: editingId, content: talkText })
    }
    else {
      createTalk.mutate({ content: talkText })
    }
  }

  const handleEdit = (talk: { id: string, content: string }) => {
    setTalkText(talk.content)
    setEditingId(talk.id)
  }

  const isPending = createTalk.isPending || updateTalk.isPending

  return (
    <div className="grid w-full flex-1 gap-5 sm:grid-cols-2">
      <form className="font-world flex flex-col gap-5" onSubmit={handleSubmit}>
        <h3>{editingId ? '编辑想法💡：' : '表达你的想法💡：'}</h3>
        <div className="flex flex-col gap-2">
          <Textarea value={talkText} onChange={e => setTalkText(e.target.value)} />

          <div className="flex w-full justify-end gap-3">
            <Button
              type="button"
              variant="destructive"
              className="w-15"
              onClick={resetForm}
            >
              重置
            </Button>
            <Button type="submit" variant="outline" className="w-15" disabled={isPending}>
              {isPending ? '发送中...' : (editingId ? '更新' : '发送')}
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
        {isLoading && <div>Loading...</div>}
        {data?.talks?.map(talk => (
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
                onClick={() => handleEdit(talk)}
                variant="outline"
                className="w-15"
              >
                编辑
              </Button>
              <Button
                onClick={() => setDeleteId(talk.id)}
                variant="destructive"
                className="w-15"
              >
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>确定要删除这个想法吗？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteTalk.mutate({ id: deleteId })}
              disabled={deleteTalk.isPending}
            >
              {deleteTalk.isPending ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminTalks

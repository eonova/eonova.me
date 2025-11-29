'use client'

import { useState } from 'react'

import { Button } from '~/components/base/button'
import { Separator } from '~/components/base/separator'
import AddFriendDialog from '~/components/pages/admin/friends/friend-add-dialog'
import LinkCard from '~/components/shared/link-card'
import { useFriends } from '~/hooks/queries/friend.query'

export default function FriendsList() {
  const { status, data } = useFriends()

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {isLoading && (
          <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <Separator
                className="h-32 rounded-2xl bg-gray-400/20 p-2 dark:bg-gray-600/20"
                key={index}
              />
            ))}
          </div>
        )}
        {isError && <div className="text-center text-red-500">加载友链失败，请刷新重试</div>}
        {isSuccess
          && ((data?.pages.flatMap(page => page.items) ?? []).length
            ? (
                <div className="flex flex-col justify-center gap-10">
                  <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {(data?.pages.flatMap(page => page.items) ?? []).map(friend => (
                      <LinkCard
                        className="p-6"
                        key={friend.id}
                        props={{
                          images: friend.avatar ?? 'https://example.com/avatar.jpg',
                          url: friend.url,
                          title: friend.name,
                          desc: friend.description ?? '这位朋友没有留下任何描述',
                        }}
                      />
                    ))}
                  </div>
                  <Button className="mx-auto" onClick={() => setOpen(true)}>
                    添加你的友链
                  </Button>
                </div>
              )
            : (
                <div className="flex h-64 flex-col items-center justify-center">
                  <div className="py-12 text-center text-gray-500">暂无友链，欢迎成为第一个朋友！</div>
                  <Button onClick={() => setOpen(true)}>添加你的友链</Button>
                </div>
              ))}
        <AddFriendDialog open={open} onOpenChange={setOpen} />
      </div>
    </>
  )
}

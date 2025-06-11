'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '~/components/base/button'
import { Separator } from '~/components/base/separator'
import AddFriendDialog from '~/components/pages/admin/friends/friend-add-dialog'
import LinkCard from '~/components/shared/link-card'
import PageTitle from '~/components/shared/page-title'
import { useTRPC } from '~/trpc/client'

const title = '友链'
const description = '感谢你愿意和我做朋友🌈'

function Page() {
  const trpc = useTRPC()
  const { status, data } = useQuery(trpc.friend.getAllFriends.queryOptions())

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageTitle
        title={title}
        description={description}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {
              Array.from({ length: 9 }).map((_, index) => (
                <Separator className="bg-gray-400/20 dark:bg-gray-600/20 rounded-2xl p-2 h-32" key={index} />
              ))
            }
          </div>
        )}
        {isError && <div className="text-red-500 text-center">加载友链失败，请刷新重试</div>}
        {isSuccess && (
          data?.items.length
            ? (
                <div className="flex flex-col justify-center gap-10">
                  <div className="w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {data.items.map(friend => (
                      <LinkCard
                        className="p-6"
                        key={friend.id}
                        props={{
                          images: friend.avatar || 'https://example.com/avatar.jpg',
                          url: friend.url,
                          title: friend.name,
                          desc: friend.description || '这位朋友没有留下任何描述',
                        }}
                      />
                    ))}
                  </div>
                  <Button className="mx-auto" onClick={() => setOpen(true)}>添加你的友链</Button>
                </div>
              )
            : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-center text-gray-500 py-12">
                    暂无友链，欢迎成为第一个朋友！
                  </div>
                  <Button onClick={() => setOpen(true)}>添加你的友链</Button>
                </div>
              )
        )}
        <AddFriendDialog open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  )
}

export default Page

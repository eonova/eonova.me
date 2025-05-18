'use client'
import { useState } from 'react'
import AddFriendDialog from '~/components/add-friend-dialog'
import { Button } from '~/components/base/button'
import FriendCard from '~/components/friend-card'
import PageTitle from '~/components/page-title'
import { FriendSkeleton } from '~/components/skeleton/friend-skeleton'
import { api } from '~/trpc/react'

interface FriendsProps {

}

const title = '友链'
const description = '感谢你愿意和我做朋友🌈'

const Friends: React.FC<FriendsProps> = () => {
  const { status, data } = api.friend.getAllFriends.useQuery()

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
                <FriendSkeleton key={index} />
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
                      <FriendCard
                        key={friend.id}
                        name={friend.name}
                        url={friend.url}
                        avatar={friend.avatar || 'https://example.com/avatar.jpg'}
                        description={friend.description || '暂无描述'}
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

export default Friends

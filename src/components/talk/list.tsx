'use client'
import { api } from "~/trpc/react"
import TalkBox from "./box"
import { Skeleton } from "../base/skeleton"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface TalkListProps {
  pageSize?: number
}

const TalkList: React.FC<TalkListProps> = ({ pageSize = 10 }) => {
  // 使用无限查询获取分页数据
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.talks.getAllTalks.useInfiniteQuery(
    {
      limit: pageSize,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  // 滚动加载观察点
  const { ref, inView } = useInView({
    threshold: 0.1,
  })

  // 触发加载更多
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  // 合并所有页面数据
  const talks = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="space-y-4">
      {/* 加载状态 */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-red-500">
          加载失败：{error.message}
        </div>
      )}

      {/* 数据列表 */}
      {talks.length > 0 && (
        <ul className="grid gap-4">
          {talks.map((talk) => (
            <li key={talk.id}>
              <TalkBox
                id={talk.id}
                time={talk.createdAt}
              >
                {talk.content}
              </TalkBox>
            </li>
          ))}
        </ul>
      )}

      {/* 加载更多指示器 */}
      <div ref={ref} className="text-center text-sm text-gray-500">
        {isFetchingNextPage && '正在加载更多...'}
        {!hasNextPage && talks.length > 0 && '没有更多内容了'}
        {!isLoading && talks.length === 0 && '暂时没有动态，快来发布第一条吧！'}
      </div>
    </div>
  )
}

export default TalkList

import type { GetInfiniteCommentsInput } from '~/trpc/routers/comments'
import NumberFlow, { continuous, NumberFlowGroup } from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import { ListFilterIcon } from 'lucide-react'

import { Button } from '~/components/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'
import { useCommentsContext } from '~/contexts/comments'
import { useTRPC } from '~/trpc/client'

function CommentHeader() {
  const { slug, sort, setSort } = useCommentsContext()
  const trpc = useTRPC()

  const commentCountQuery = useQuery(trpc.comments.getCommentCount.queryOptions({ slug }))
  const replyCountQuery = useQuery(trpc.comments.getReplyCount.queryOptions({ slug }))
  return (
    <div className="flex items-center justify-between px-1">
      <NumberFlowGroup>
        <div>
          {commentCountQuery.status === 'pending' && `评论 --`}
          {commentCountQuery.status === 'error' ? '错误' : null}
          {commentCountQuery.status === 'success' && (
            <NumberFlow
              willChange
              plugins={[continuous]}
              value={commentCountQuery.data.comments}
              suffix="&nbsp;评论"
            />
          )}
          {' · '}
          {replyCountQuery.status === 'pending' && '回复 --'}
          {replyCountQuery.status === 'error' && '错误'}
          {replyCountQuery.status === 'success' && (
            <NumberFlow
              willChange
              plugins={[continuous]}
              value={replyCountQuery.data.replies}
              suffix="&nbsp;回复"
            />
          )}
        </div>
      </NumberFlowGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
            <ListFilterIcon className="size-3.5" />
            <span>排序方式</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => {
              setSort(value as GetInfiniteCommentsInput['sort'])
            }}
          >
            <DropdownMenuRadioItem value="newest">最新</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">最旧</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CommentHeader

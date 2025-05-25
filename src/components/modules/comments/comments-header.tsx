import type { GetInfiniteCommentsInput } from '~/trpc/routers/comments'

import NumberFlow, { continuous, NumberFlowGroup } from '@number-flow/react'
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
import { api } from '~/trpc/react'

function CommentHeader() {
  const { slug, sort, setSort } = useCommentsContext()

  const commentsCountQuery = api.comments.getCommentsCount.useQuery({ slug })
  const repliesCountQuery = api.comments.getRepliesCount.useQuery({ slug })

  return (
    <div className="flex items-center justify-between px-1">
      <NumberFlowGroup>
        <div>
          {commentsCountQuery.status === 'pending' && `评论 --`}
          {commentsCountQuery.status === 'error' ? '错误' : null}
          {
            commentsCountQuery.status === 'success'
            && (
              <NumberFlow
                willChange
                plugins={[continuous]}
                value={commentsCountQuery.data.comments}
                suffix="&nbsp;评论"
              />
            )
          }
          {' · '}
          {repliesCountQuery.status === 'pending' && '回复 --'}
          {repliesCountQuery.status === 'error' && '错误'}
          {
            repliesCountQuery.status === 'success'
            && (
              <NumberFlow
                willChange
                plugins={[continuous]}
                value={repliesCountQuery.data.replies}
                suffix="&nbsp;回复"
              />
            )
          }
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
            <DropdownMenuRadioItem value="newest">
              最新
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">
              最旧
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CommentHeader

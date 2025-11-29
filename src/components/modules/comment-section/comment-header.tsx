import type { ListCommentsInput } from '~/orpc/routers'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { ListFilterIcon } from 'lucide-react'
import { Button } from '~/components/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'

import { useCommentsContext } from '~/contexts/comments.context'
import { useContentCommentCount, useReplyCount } from '~/hooks/queries/comment.query'

function CommentHeader() {
  const { slug, sort, setSort, contentType } = useCommentsContext()

  const commentCountQuery = useContentCommentCount({ slug }, contentType)
  const replyCountQuery = useReplyCount({ slug }, contentType)

  return (
    <div className="flex items-center justify-between px-1">
      <NumberFlowGroup>
        <div>
          {commentCountQuery.isLoading && `-- 评论 ${0}`}
          {commentCountQuery.isError && '错误'}
          {commentCountQuery.isSuccess && (
            <NumberFlow
              value={commentCountQuery.data.count}
              suffix={` 条评论`}
              data-testid="blog-comment-count"
            />
          )}
          {' · '}
          {replyCountQuery.isLoading && `-- 回复 ${0}`}
          {replyCountQuery.isError && '错误'}
          {replyCountQuery.isSuccess && (
            <NumberFlow
              value={replyCountQuery.data.count}
              suffix={` 条回复`}
              data-testid="reply-count"
            />
          )}
        </div>
      </NumberFlowGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
            <ListFilterIcon className="size-3.5" />
            <span>排序</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => {
              setSort(value as ListCommentsInput['sort'])
            }}
          >
            <DropdownMenuRadioItem value="newest">最新的</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">最早的</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CommentHeader

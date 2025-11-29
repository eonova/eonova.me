import { MoreVerticalIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/base/alert-dialog'
import { Button, buttonVariants } from '~/components/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'

import { useCommentContext } from '~/contexts/comment.context'
import { useCommentsContext } from '~/contexts/comments.context'
import { useDeleteContentComment } from '~/hooks/queries/comment.query'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useSession } from '~/lib/auth-client'

function CommentMenu() {
  const { comment } = useCommentContext()
  const { slug, contentType } = useCommentsContext()
  const { data: session } = useSession()
  const [copy] = useCopyToClipboard()

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteContentComment({ slug }, contentType, () => {
    toast.success('评论删除成功')
  })

  const {
    isDeleted,
    id,
    user: { id: userId },
    parentId,
  } = comment

  const commentQuery = parentId ? `comment=${parentId}&reply=${id}` : `comment=${id}`

  const isAuthor = !isDeleted && session?.user.id === userId

  const handleDeleteComment = () => {
    if (isDeleting)
      return
    deleteComment({ id })
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="打开评论操作菜单"
            data-testid="comment-menu-button"
          >
            <MoreVerticalIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              void copy({
                text: `${globalThis.location.origin}/blog/${slug}?${commentQuery}`,
                successMessage: '评论链接已复制',
              })}
          >
            复制评论链接
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            {isAuthor && (
              <DropdownMenuItem
                disabled={isDeleting}
                aria-disabled={isDeleting}
                data-testid="comment-delete-button"
                variant="destructive"
              >
                删除评论
              </DropdownMenuItem>
            )}
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent data-testid="comment-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>删除评论</AlertDialogTitle>
          <AlertDialogDescription>确认删除此评论吗？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteComment}
            className={buttonVariants({ variant: 'destructive' })}
            data-testid="comment-dialog-delete-button"
          >
            删除评论
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CommentMenu

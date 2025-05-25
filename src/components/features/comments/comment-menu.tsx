import { MoreVerticalIcon } from 'lucide-react'
import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useSession } from '~/lib/auth-client'
import { api } from '~/trpc/react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../base/alert-dialog'
import { Button, buttonVariants } from '../base/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../base/dropdown-menu'
import { toast } from '../base/toaster'

function CommentMenu() {
  const { comment } = useCommentContext()
  const { slug } = useCommentsContext()
  const { data: session } = useSession()
  const utils = api.useUtils()
  const [copy] = useCopyToClipboard()

  const deleteCommentMutation = api.comments.delete.useMutation({
    onSuccess: () => toast.success('已删除评论'),
    onError: error => toast.error(error.message),
    onSettled: () => {
      utils.comments.invalidate()
    },
  })

  const {
    isDeleted,
    id,
    user: { id: userId },
    parentId,
  } = comment

  const commentQuery = parentId ? `comment=${parentId}&reply=${id}` : `comment=${id}`

  const isAuthor = !isDeleted && session?.user.id === userId

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="开启选单"
          >
            <MoreVerticalIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              void copy({
                text: `${globalThis.location.origin}/posts/${slug}?${commentQuery}`,
                successMessage: '链接已复制到剪贴板',
              })}
          >
            复制链接
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            {isAuthor
              ? (
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-500"
                    disabled={deleteCommentMutation.isPending}
                    aria-disabled={deleteCommentMutation.isPending}
                  >
                    删除
                  </DropdownMenuItem>
                )
              : null}
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除评论</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除此评论吗？此动作无法复原。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteCommentMutation.mutate({ id })
            }}
            className={buttonVariants({ variant: 'destructive' })}
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CommentMenu

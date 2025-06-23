import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreVerticalIcon } from 'lucide-react'
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
import { toast } from '~/components/base/toaster'
import { useCommentContext } from '~/contexts/comment'
import { useCommentsContext } from '~/contexts/comments'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useSession } from '~/lib/auth-client'
import { useTRPC } from '~/trpc/client'

function CommentMenu() {
  const { comment } = useCommentContext()
  const { slug } = useCommentsContext()
  const { data: session } = useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [copy] = useCopyToClipboard()
  const deleteCommentMutation = useMutation(
    trpc.comments.delete.mutationOptions({
      onSuccess: () => {
        toast.success('评论已删除')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getInfiniteComments.infiniteQueryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getCommentsCount.queryKey({ slug }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getRepliesCount.queryKey({ slug }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getTotalCommentsCount.queryKey({ slug }),
        })
      },
    }),
  )

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
          <Button variant="ghost" size="icon" className="size-8" aria-label="开启选单">
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
          <AlertDialogDescription>您确定要删除此评论吗？此动作无法复原。</AlertDialogDescription>
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

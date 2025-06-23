import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  Button,
  buttonVariants,
  toast,
} from '~/components/base'

import { useMessageContext } from '~/contexts/message'
import { useTRPC } from '~/trpc/client'

function DeleteButton() {
  const { message } = useMessageContext()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const guestbookMutation = useMutation(
    trpc.guestbook.delete.mutationOptions({
      onSuccess: () => {
        toast.success('留言删除成功')
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.guestbook.getInfiniteMessages.infiniteQueryKey(),
        }),
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const handleDeleteMessage = (id: string) => {
    guestbookMutation.mutate({ id })
  }

  return (
    <div className="mt-4 flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={guestbookMutation.isPending}
            aria-disabled={guestbookMutation.isPending}
            data-testid="guestbook-delete-button"
          >
            删除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent data-testid="guestbook-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>删除评论</AlertDialogTitle>
            <AlertDialogDescription>您确定要删除此评论吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteMessage(message.id)
              }}
              className={buttonVariants({ variant: 'destructive' })}
              data-testid="guestbook-dialog-delete-button"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteButton

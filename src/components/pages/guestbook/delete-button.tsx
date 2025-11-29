import type { ListMessagesOutput } from '~/orpc/routers'
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
  Button,
  buttonVariants,
} from '~/components/base'
import { useDeleteMessage } from '~/hooks/queries/message.query'

interface DeleteButtonProps {
  message: ListMessagesOutput['messages'][number]
}

function DeleteButton(props: DeleteButtonProps) {
  const { message } = props
  const { mutate: deleteMessage, isPending } = useDeleteMessage(() => {
    toast.success('留言删除成功')
  })

  const handleDeleteMessage = (id: string) => {
    deleteMessage({ id })
  }

  return (
    <div className="mt-4 flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isPending}
            aria-disabled={isPending}
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

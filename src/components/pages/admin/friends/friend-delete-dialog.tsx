import { useMutation } from '@tanstack/react-query'
import { memo } from 'react'
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
} from '~/components/base/alert-dialog'
import { useFriendDialogsStore } from '~/stores/friend'
import { useTRPC } from '~/trpc/client'

const AlertDialogContentMemo = memo(AlertDialogContent)
interface DeleteFriendDialogProps {
  id: string
}

const DeleteFriendDialog: React.FC<DeleteFriendDialogProps> = ({
  id,
}) => {
  const friendDialogStore = useFriendDialogsStore()
  const trpc = useTRPC()
  const friendMutation = useMutation(trpc.friend.deleteFriend.mutationOptions(
    {
      onSuccess: () => {
        friendDialogStore.setDeleteDialogs(false)
        toast.success('删除成功')
      },
      onError: error => toast.error(`删除图片失败：${error}`),
      onSettled: () => trpc.friend.getAllFriends.queryOptions(),
    },
  ))

  return (
    <AlertDialog
      open={friendDialogStore.deleteDialog}
      onOpenChange={(v) => {
        friendDialogStore.setDeleteDialogs(v)
      }}
    >
      <AlertDialogContentMemo>
        <AlertDialogHeader>
          <AlertDialogTitle>删除</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除这个好友吗?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => friendMutation.mutate({ id })}>确定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContentMemo>
    </AlertDialog>
  )
}

export default DeleteFriendDialog

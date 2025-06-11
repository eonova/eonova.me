import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
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
import { useAlbumDialogsStore } from '~/stores/album'
import { useTRPC } from '~/trpc/client'

const AlertDialogContentMemo = memo(AlertDialogContent)
interface DeleteAlbumDialogProps {
  id: string
  imageUrl: string
}

const DeleteAlbumDialog: React.FC<DeleteAlbumDialogProps> = ({
  id,
  imageUrl,
}) => {
  const albumDialogStore = useAlbumDialogsStore()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const albumMutation = useMutation(trpc.album.deleteImage.mutationOptions({
    onSuccess: () => {
      albumDialogStore.setDeleteDialogs(false)
      toast.success('删除成功')
    },
    onError: error => toast.error(`删除图片失败：${error}`),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.album.getAllImages.queryKey(),
      })
    },
  }),
  )

  return (
    <AlertDialog
      open={albumDialogStore.deleteDialog}
      onOpenChange={(v) => {
        albumDialogStore.setDeleteDialogs(v)
      }}
    >
      <AlertDialogContentMemo>
        <AlertDialogHeader>
          <AlertDialogTitle>删除</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除这张图片吗?
            <Image
              src={imageUrl} // 假设 imageUrl 是图片的地址
              alt="Image preview"
              width={100}
              height={80}
              className="object-cover w-50 h-50 my-2 rounded-2xl"
              loading="lazy"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => albumMutation.mutate({ id })}>确定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContentMemo>
    </AlertDialog>
  )
}

export default DeleteAlbumDialog

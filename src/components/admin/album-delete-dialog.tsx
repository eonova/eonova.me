
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/base/alert-dialog"
import { useAlbumDialogsStore } from "~/stores/album"
import { api } from "~/trpc/react"
import Image from 'next/image'

interface DeleteAlbumDialogProps {
  id: string
  imageUrl: string
}

const DeleteAlbumDialog: React.FC<DeleteAlbumDialogProps> = ({
  id,
  imageUrl
}) => {
  const albumDialogStore = useAlbumDialogsStore()
  const utils = api.useUtils()
  const albumMutation = api.album.deleteImage.useMutation({
    onSuccess: () => {
      albumDialogStore.setDeleteDialogs(false)
      toast.success('删除成功')
    },
    onError: (error) => toast.error('删除图片失败：' + error),
    onSettled: () => utils.album.getAllImages.invalidate(),
  })

  return (
    <AlertDialog open={albumDialogStore.deleteDialog}
      onOpenChange={(v) => {
        albumDialogStore.setDeleteDialogs(v)
      }}>
      <AlertDialogContent>
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
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => albumMutation.mutate({ id })}>确定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlbumDialog;

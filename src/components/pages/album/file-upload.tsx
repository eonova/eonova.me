'use client'

import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'sonner'
import { Input } from '~/components/base/input'
import { UPYUN_DOMAIN, UPYUN_UPLOAD_PATH } from '~/config/album'
import { useUpyunUpload } from '~/hooks/queries/upyun.query'
import { orpc } from '~/orpc/client'
import { cn } from '~/utils'

interface FileUploadProps {
  imageUrl: string
  className?: string
  setImageUrl: (url: string) => void
}

/** 图片上传 */
const FileUpload: React.FC<FileUploadProps> = ({ imageUrl, className, setImageUrl }) => {
  const queryClient = useQueryClient()
  const uploadPath = UPYUN_UPLOAD_PATH.replace(/^[/\\]+|[/\\]+$/g, '')

  function handleImageUrl(path: string) {
    const upyunDomain = UPYUN_DOMAIN
    const domain = upyunDomain?.endsWith('/') ? upyunDomain.slice(0, -1) : upyunDomain
    return `${domain}/${path}`
  }

  const { mutate } = useUpyunUpload({
    onSuccess: (data) => {
      const url = handleImageUrl(data.path)
      setImageUrl(url)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orpc.album.listAllImages.key() })
    },
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file)
      return
    // 读取文件为 base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = ((reader.result as string)?.split(',')[1] ?? '') as string
      mutate({
        file: base64,
        path: `${uploadPath}/${file.name}`, // 你可以自定义路径
        filename: file.name,
        mimetype: file.type,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      {imageUrl
        ? (
            <Image unoptimized src={imageUrl} alt="image" width={100} height={100} />
          )
        : (
            <Input
              className={cn('size-full min-h-50 cursor-pointer', className)}
              type="file"
              onChange={handleUpload}
            />
          )}
    </>
  )
}

export default FileUpload

import { useState } from 'react'
import { toast } from '~/components/base/toaster'

interface CopyOptions {
  text: string
  timeout?: number
  successMessage?: React.ReactNode
  errorMessage?: React.ReactNode
}

export function useCopyToClipboard(): [(options: CopyOptions) => Promise<void>, boolean] {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async ({ text, timeout, successMessage, errorMessage }: CopyOptions) => {
    if (isCopied)
      return

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.success(successMessage ?? '已复制到剪贴板！')

      setTimeout(() => {
        setIsCopied(false)
      }, timeout ?? 2000)
    }
    catch {
      toast.error(errorMessage ?? '无法复制到剪贴板。请再试一次！')
    }
  }

  return [copy, isCopied]
}

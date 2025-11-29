import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { authClient } from '~/lib/auth-client'

interface UseSignOutOptions {
  redirectTo?: string
}

export function useSignOut(options: UseSignOutOptions = {}) {
  const { redirectTo } = options

  const router = useRouter()

  return async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          if (redirectTo) {
            window.location.assign(redirectTo)
          }
          else {
            router.refresh()
          }
          toast.success('已退出登录')
        },
        onError: () => {
          toast.error('退出登录失败，请稍后重试')
        },
      },
    })
  }
}

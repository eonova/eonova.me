'use client'
import { SiGithub } from '@icons-pack/react-simple-icons'
import { LoaderIcon } from 'lucide-react'
import { redirect, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '~/components/base/badge'
import { Button } from '~/components/base/button'
import { Link } from '~/components/base/link'
import { authClient } from '~/lib/auth-client'

type Provider = 'github' | 'google'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

function LastUsed() {
  return (
    <Badge variant="outline" className="absolute -top-2 -right-2 bg-background">
      最近使用
    </Badge>
  )
}

function AdminLoginPage() {
  const [isPending, setIsPending] = useState(false)
  const [lastUsedProvider, setLastUsedProvider] = useState<Provider | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const provider = localStorage.getItem('last-used-provider') as Provider | null
    setLastUsedProvider(provider)
  }, [])

  const handleSignIn = async (provider: Provider) => {
    localStorage.setItem('last-used-provider', provider)
    await authClient.signIn.social({
      provider,
      callbackURL: `${pathname}`,
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false)
          redirect('/admin')
        },
        onError: () => {
          setIsPending(false)
          toast.error('登录失败，请稍后重试')
        },
        onRequest: () => {
          setIsPending(true)
        },
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-2 text-left">
          <p className="text-xs text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">管理员登录</h1>
          <p className="text-sm text-muted-foreground">
            请输入管理员账号登录后台。如果没有权限，请联系站点管理员。
          </p>
        </div>

        <div className="my-6 flex flex-col gap-4">
          <Button
            className="relative h-10 gap-3 rounded-xl font-semibold"
            onClick={() => handleSignIn('github')}
            disabled={isPending}
            data-testid="github-sign-in-button"
          >
            {isPending ? <LoaderIcon className="size-4 animate-spin" /> : <SiGithub className="size-5" />}
            继续使用 GitHub
            {lastUsedProvider === 'github' && <LastUsed />}
          </Button>

          <Button
            className="relative h-10 gap-3 rounded-xl border font-semibold"
            variant="ghost"
            onClick={() => handleSignIn('google')}
            disabled={isPending}
          >
            {isPending ? <LoaderIcon className="size-4 animate-spin" /> : <GoogleIcon className="size-5" />}
            继续使用 Google
            {lastUsedProvider === 'google' && <LastUsed />}
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-center text-xs text-muted-foreground">
          <p>
            继续使用后，您将同意我们的
            {' '}
            <Link href="/terms" className="text-foreground underline">
              服务条款
            </Link>
            {' '}
            和
            {' '}
            <Link href="/privacy" className="text-foreground underline">
              隐私政策
            </Link>
            。
          </p>
          <p>登录成功后，如果您具备管理员权限，将自动跳转到后台页面。</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage

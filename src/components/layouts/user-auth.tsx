'use client'

import { LogIn, LogOutIcon, Settings, UserIcon } from 'lucide-react'
import { Button } from '~/components/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'
import { Skeleton } from '~/components/base/skeleton'
import { useSignInDialog } from '~/hooks/use-sign-in-dialog'
import { authClient, useSession } from '~/lib/auth-client'

function UserAuth() {
  const { data: session, isPending } = useSession()
  const dialogStore = useSignInDialog()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload()
        },
      },
    })
  }

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />
  }

  if (!session) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-0 duration-200 sm:size-9"
        onClick={() => dialogStore.setOpen(true)}
        data-testid="sign-in-button"
      >
        <LogIn className="size-5 sm:size-4" />
      </Button>
    )
  }

  const { name, email, role } = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="flex size-8 cursor-pointer items-center justify-center rounded-full p-0 duration-200 sm:size-9"
          data-testid="user-auth-button"
          aria-label="user-auth-button"
        >
          <UserIcon className="size-5 sm:size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          role === 'admin' && (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <a href="/admin" className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  管理后台
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )
        }
        <DropdownMenuItem className="cursor-pointer" asChild>
          <a href="/account" className="flex items-center gap-2">
            <Settings className="size-4" />
            账号设置
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
          data-testid="logout-button"
        >
          <LogOutIcon className="size-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAuth

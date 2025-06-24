'use client'

import { LogOutIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/base/avatar'
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
import { signOut, useSession } from '~/lib/auth-client'
import { useDialogsStore } from '~/stores/dialogs'
import { getAvatarAbbreviation, getDefaultImage } from '~/utils'

function UserAuth() {
  const { data: session, isPending } = useSession()
  const dialogStore = useDialogsStore()

  const handleSignOut = async () => {
    await signOut({
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
        onClick={() => dialogStore.setIsSignInOpen(true)}
        data-testid="sign-in-button"
      >
        登录
      </Button>
    )
  }

  const { id, image, name, email } = session.user
  const defaultImage = getDefaultImage(id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 rounded-full p-0" variant="ghost" data-testid="user-menu">
          <Avatar className="size-8" data-testid="user-avatar">
            <AvatarImage className="size-8" src={image ?? defaultImage} />
            <AvatarFallback>{getAvatarAbbreviation(name)}</AvatarFallback>
          </Avatar>
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
        <DropdownMenuItem asChild>
          <a href="/admin" className="flex items-center gap-2">
            <UserIcon className="size-4" />
            管理后台
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
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

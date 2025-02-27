import { useSession } from 'next-auth/react'

import { useDialogsStore } from '~/stores/dialogs'
import { getAvatarAbbreviation, getDefaultUser } from '~/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../base/avatar'
import { Button } from '../base/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '../base/dropdown-menu'
import { Skeleton } from '../base/skeleton'

function AdminProfileDropdown() {
  const { data, status } = useSession()
  const dialogStore = useDialogsStore()

  if (status === 'loading') {
    return <Skeleton className="size-9 rounded-full" />
  }

  if (!data) {
    return (
      <Button
        size="sm"
        onClick={() => {
          dialogStore.setDialogs(true)
        }}
      >
        登录
      </Button>
    )
  }

  const { id, image, name, email } = data.user
  const { defaultImage, defaultName } = getDefaultUser(id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 rounded-full" variant="ghost">
          <Avatar className="size-9">
            <AvatarImage className="size-9" src={image ?? defaultImage} />
            <AvatarFallback>{getAvatarAbbreviation(name ?? defaultName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="text-sm">{name}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AdminProfileDropdown

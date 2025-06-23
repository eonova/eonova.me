import { Avatar, AvatarFallback, AvatarImage } from '~/components/base/avatar'
import { Button } from '~/components/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'
import { Skeleton } from '~/components/base/skeleton'
import { useSession } from '~/lib/auth-client'
import { useDialogsStore } from '~/stores/dialogs'
import { getAvatarAbbreviation, getDefaultImage } from '~/utils'

function AdminProfileDropdown() {
  const { data: session, isPending } = useSession()
  const dialogStore = useDialogsStore()

  if (isPending) {
    return <Skeleton className="size-9 rounded-full" />
  }

  if (!session) {
    return (
      <Button size="sm" onClick={() => dialogStore.setIsSignInOpen(true)}>
        登录
      </Button>
    )
  }

  const { id, image, name, email } = session.user
  const defaultImage = getDefaultImage(id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 rounded-full" variant="ghost">
          <Avatar className="size-9">
            <AvatarImage className="size-9" src={image ?? defaultImage} />
            <AvatarFallback>{getAvatarAbbreviation(name)}</AvatarFallback>
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

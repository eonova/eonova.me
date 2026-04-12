'use client'

import { CodeIcon, CommandIcon, LinkIcon, LogInIcon, LogOutIcon, ShieldIcon, UserCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

import { Button } from '~/components/base/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/base/command'
import { SOCIAL_LINKS } from '~/config/links'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useSignInDialog } from '~/hooks/use-sign-in-dialog'
import { useSignOut } from '~/hooks/use-sign-out'
import { useSession } from '~/lib/auth-client'

interface CommandAction {
  title: string
  icon: React.ReactNode
  onSelect: () => void | Promise<void>
}

interface CommandGroup {
  name: string
  actions: CommandAction[]
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [copy] = useCopyToClipboard()
  const { data: session } = useSession()
  const { openDialog } = useSignInDialog()
  const signOut = useSignOut({ redirectTo: '/' })
  const router = useRouter()

  function closeMenu() {
    setIsOpen(false)
  }

  function openMenu() {
    setIsOpen(true)
  }

  function toggleMenu() {
    setIsOpen(value => !value)
  }

  function openExternalLink(url: string) {
    closeMenu()
    window.open(url, '_blank', 'noopener')
  }

  async function copyCurrentUrl() {
    closeMenu()
    await copy({ text: globalThis.location.href })
  }

  function handleAccountNavigate() {
    closeMenu()
    router.push('/account')
  }

  function handleAdminNavigate() {
    closeMenu()
    router.push('/admin')
  }

  function handleSignIn() {
    closeMenu()
    openDialog()
  }

  async function handleSignOut() {
    closeMenu()

    await signOut()
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const accountActions: CommandAction[] = session
    ? [
        {
          title: '账户',
          icon: <UserCircleIcon className="size-4" />,
          onSelect: handleAccountNavigate,
        },
        ...(session.user.role === 'admin'
          ? [
              {
                title: 'Admin',
                icon: <ShieldIcon className="size-4" />,
                onSelect: handleAdminNavigate,
              },
            ]
          : []),
        {
          title: '退出登录',
          icon: <LogOutIcon className="size-4" />,
          onSelect: handleSignOut,
        },
      ]
    : [
        {
          title: '登录',
          icon: <LogInIcon className="size-4" />,
          onSelect: handleSignIn,
        },
      ]

  const generalActions: CommandAction[] = [
    {
      title: '复制链接',
      icon: <LinkIcon className="size-4" />,
      onSelect: copyCurrentUrl,
    },
    {
      title: '源代码',
      icon: <CodeIcon className="size-4" />,
      onSelect: () => {
        openExternalLink('https://github.com/eonova/eonova.me')
      },
    },
  ]

  const socialActions: CommandAction[] = SOCIAL_LINKS.map(link => ({
    title: link.title,
    icon: <link.icon className="size-4" />,
    onSelect: () => {
      openExternalLink(link.href)
    },
  }))

  const groups: CommandGroup[] = [
    { name: '账户', actions: accountActions },
    { name: '通用', actions: generalActions },
    { name: '社交', actions: socialActions },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={openMenu}
        aria-label="打开命令菜单"
        data-testid="command-menu-button"
        className="cursor-pointer"
      >
        <CommandIcon className="size-5" />
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <Command>
          <CommandInput placeholder="搜索" />
          <CommandList>
            <CommandEmpty>没有找到结果</CommandEmpty>
            {groups.map((group, index) => (
              <Fragment key={group.name}>
                <CommandGroup heading={group.name}>
                  {group.actions.map(action => (
                    <CommandItem key={action.title} onSelect={action.onSelect}>
                      {action.icon}
                      {action.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {index === groups.length - 1 ? null : <CommandSeparator />}
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

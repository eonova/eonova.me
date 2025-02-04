'use client'

import { SiFacebook, SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { CodeIcon, CommandIcon, LinkIcon, LogInIcon, LogOutIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { Fragment, useCallback, useEffect, useState } from 'react'

import {
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useDialogsStore } from '~/stores/dialogs'
import { Button } from './base/button'
import { CommandDialog, CommandEmpty, CommandFooter, CommandFooterTrigger, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './base/command'
import { Kbd } from './base/kbd'
import Logo from './logo'

type Groups = Array<{
  name: string
  actions: Array<{
    title: string
    icon: React.ReactNode
    onSelect: () => void | Promise<void>
  }>
}>

function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectingValue, setSelectingValue] = useState('')
  const [copy] = useCopyToClipboard()
  const { status } = useSession()
  const dialogStore = useDialogsStore()

  const isSelectingCommand = ['登出', '复制链接'].includes(
    selectingValue,
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(value => !value)
      }
    }

    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [])

  const openLink = useCallback((url: string) => {
    setIsOpen(false)
    window.open(url, '_blank', 'noopener')
  }, [])

  const groups: Groups = [
    {
      name: '账户',
      actions: [
        ...(status === 'authenticated'
          ? [
              {
                title: '登出',
                icon: <LogOutIcon className="mr-3 size-4" />,
                onSelect: () => signOut(),
              },
            ]
          : [
              {
                title: '登入',
                icon: <LogInIcon className="mr-3 size-4" />,
                onSelect: () => {
                  setIsOpen(false)
                  dialogStore.setDialogs(true)
                },
              },
            ]),
      ],
    },
    {
      name: '一般',
      actions: [
        {
          title: '复制链接',
          icon: <LinkIcon className="mr-3 size-4" />,
          onSelect: async () => {
            setIsOpen(false)

            await copy({ text: globalThis.location.href })
          },
        },
        {
          title: '源代码',
          icon: <CodeIcon className="mr-3 size-4" />,
          onSelect: () => {
            openLink('https://github.com/tszhong0411/honghong.me')
          },
        },
      ],
    },
    {
      name: '社群',
      actions: [
        {
          title: 'GitHub',
          icon: <SiGithub className="mr-3 size-4" />,
          onSelect: () => {
            openLink(SITE_GITHUB_URL)
          },
        },
        {
          title: 'Facebook',
          icon: <SiFacebook className="mr-3 size-4" />,
          onSelect: () => {
            openLink(SITE_FACEBOOK_URL)
          },
        },
        {
          title: 'Instagram',
          icon: <SiInstagram className="mr-3 size-4" />,
          onSelect: () => {
            openLink(SITE_INSTAGRAM_URL)
          },
        },
        {
          title: 'X',
          icon: <SiX className="mr-3 size-4" />,
          onSelect: () => {
            openLink(SITE_X_URL)
          },
        },
        {
          title: 'YouTube',
          icon: <SiYoutube className="mr-3 size-4" />,
          onSelect: () => {
            openLink(SITE_YOUTUBE_URL)
          },
        },
      ],
    },
  ]

  return (
    <>
      <Button
        variant="ghost"
        className="size-9 p-0"
        onClick={() => {
          setIsOpen(true)
        }}
        aria-label="开启指令选单"
      >
        <CommandIcon className="size-4" />
      </Button>
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        value={selectingValue}
        onValueChange={setSelectingValue}
      >
        <CommandInput placeholder="输入指令或搜寻" />
        <CommandList>
          <CommandEmpty>没有找到结果。</CommandEmpty>
          {groups.map((group, i) => (
            <Fragment key={group.name}>
              <CommandGroup heading={group.name}>
                {group.actions.map(action => (
                  <CommandItem key={action.title} onSelect={action.onSelect}>
                    {action.icon}
                    {action.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              {i === groups.length - 1 ? null : <CommandSeparator />}
            </Fragment>
          ))}
        </CommandList>
        <CommandFooter>
          <Logo className="size-4" />
          <CommandFooterTrigger triggerKey={<Kbd keys={['enter']} className="py-0" />}>
            {
              isSelectingCommand
                ? '打开命令'
                : '打开链接'
            }
          </CommandFooterTrigger>
        </CommandFooter>
      </CommandDialog>
    </>
  )
}

export default CommandMenu

'use client'

// Algolia DocSearch
import { DocSearch } from '@docsearch/react'
import { SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { CommandIcon, LogInIcon, LogOutIcon } from 'lucide-react'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/base'
import {
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'
import { signOut, useSession } from '~/lib/auth-client'
import { env, flags } from '~/lib/env'
import { useDialogsStore } from '~/stores/dialogs'

import { CommandDialog, CommandEmpty, CommandFooter, CommandFooterTrigger, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../base/command'
import { Kbd } from '../base/kbd'
import { SvgLogo } from '../shared/logo'

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
  const { data: session } = useSession()
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
        ...(session
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
                  dialogStore.setIsSignInOpen(true)
                },
              },
            ]),
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
    <div>
      <Button
        variant="ghost"
        className="size-8 sm:size-9 p-0 flex justify-center items-center rounded-full cursor-pointer duration-200"
        onClick={() => setIsOpen(true)}
        aria-label="开启指令选单"
      >
        <CommandIcon className="size-5 sm:size-4" />
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen} value={selectingValue} onValueChange={setSelectingValue}>
        <CommandInput
          placeholder="输入指令或搜寻"
          onValueChange={value => setSelectingValue(value)}
        />
        <CommandList>
          <CommandEmpty>没有找到结果。</CommandEmpty>

          {/* 指令分组 */}
          {groups.map((group, i) => (
            <Fragment key={group.name}>
              <CommandGroup heading={group.name}>
                {group.actions.map((action, index) => (
                  <CommandItem
                    key={index}
                    onSelect={action.onSelect}
                    className="cursor-pointer duration-200"
                  >
                    {action.icon ?? null}
                    {action.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              {i < groups.length - 1 && <CommandSeparator />}
            </Fragment>
          ))}

          {/* 搜索功能分组 */}
          {
            flags.search && (
              <CommandGroup heading="搜索">
                <DocSearch
                  appId={env.ALGOLIA_APP_ID}
                  apiKey={env.ALGOLIA_SEARCH_ONLY_API_KEY}
                  indexName="your_index_name"
                  placeholder="搜索文档"
                  searchParameters={{
                    facetFilters: [['version:1.0.0']],
                  }}
                />
              </CommandGroup>
            )
          }
        </CommandList>
        <CommandFooter>
          <SvgLogo className="size-6 justify-center items-center" />
          <CommandFooterTrigger triggerKey={<Kbd keys={['enter']} className="py-0" />}>
            {isSelectingCommand ? '打开命令' : '打开链接'}
          </CommandFooterTrigger>
        </CommandFooter>
      </CommandDialog>
    </div>
  )
}

export default CommandMenu

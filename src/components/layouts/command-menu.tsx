'use client'

// Algolia DocSearch
import { DocSearch } from '@docsearch/react'
import { SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { useQuery } from '@tanstack/react-query'

import {
  CommandIcon,
  FileTextIcon,
  FolderIcon,
  LogInIcon,
  LogOutIcon,
  SearchIcon,
  StickyNoteIcon,
} from 'lucide-react'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/base'
import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandFooterTrigger,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/base/command'
import { Kbd } from '~/components/base/kbd'

import {
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '~/config/constants'
import { useDebouncedCallback } from '~/hooks/use-debounced-callback'
import { signOut, useSession } from '~/lib/auth-client'
import { env, flags } from '~/lib/env'
import { useDialogsStore } from '~/stores/dialogs'
import { useTRPC } from '~/trpc/client'
import { SvgLogo } from '../shared/logo'

type Groups = Array<{
  name: string
  actions: Array<{
    title: string
    icon: React.ReactNode
    onSelect: () => void | Promise<void>
  }>
}>

interface SearchResult {
  id: string
  title: string
  type: 'post' | 'note' | 'project'
  url: string
}

function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectingValue, setSelectingValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const dialogStore = useDialogsStore()
  const trpc = useTRPC()

  const isSelectingCommand = ['登出', '复制链接'].includes(selectingValue)

  // Use useQuery at the top level with proper enabled condition
  const { data: searchResults = [] } = useQuery(
    trpc.search.searchContent.queryOptions(
      {
        query: searchQuery,
        type: 'all',
        limit: 8,
      },
      {
        enabled: searchQuery.length >= 2,
      },
    ),
  )

  // Transform the search results to match the expected format
  const transformedSearchResults: SearchResult[] = searchResults.map((result) => ({
    id: result.id,
    title: result.title,
    type: result.type,
    url: result.url,
  }))

  const debouncedSearch = useDebouncedCallback(
    useCallback((query: string) => {
      if (query.length < 2) {
        setSearchQuery('')
        return
      }
      setSearchQuery(query)
    }, []),
    300,
  )

  useEffect(() => {
    if (selectingValue && !isSelectingCommand) {
      debouncedSearch(selectingValue)
    } else {
      setSearchQuery('')
    }
  }, [selectingValue, isSelectingCommand, debouncedSearch])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((value) => !value)
      }
      // Ctrl+/ or Cmd+/ to open search page directly
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        window.location.href = '/search'
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

  const navigateToResult = useCallback((url: string) => {
    setIsOpen(false)
    window.location.href = url
  }, [])

  const getResultIcon = (type: 'post' | 'note' | 'project') => {
    switch (type) {
      case 'post':
        return <FileTextIcon className="mr-3 size-4" />
      case 'note':
        return <StickyNoteIcon className="mr-3 size-4" />
      case 'project':
        return <FolderIcon className="mr-3 size-4" />
    }
  }

  const groups: Groups = [
    {
      name: '导航',
      actions: [
        {
          title: '搜索页面',
          icon: <SearchIcon className="mr-3 size-4" />,
          onSelect: () => {
            setIsOpen(false)
            window.location.href = '/search'
          },
        },
      ],
    },
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
        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-0 duration-200 sm:size-9"
        onClick={() => setIsOpen(true)}
        aria-label="开启指令选单"
      >
        <CommandIcon className="size-5 sm:size-4" />
      </Button>

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        value={selectingValue}
        onValueChange={setSelectingValue}
      >
        <CommandInput
          placeholder="输入指令或搜寻"
          onValueChange={(value) => setSelectingValue(value)}
        />
        <CommandList>
          <CommandEmpty>没有找到结果。</CommandEmpty>

          {/* 搜索结果分组 */}
          {transformedSearchResults.length > 0 && (
            <>
              <CommandGroup heading="搜索结果">
                {transformedSearchResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => navigateToResult(result.url)}
                    className="cursor-pointer duration-200"
                  >
                    {getResultIcon(result.type)}
                    {result.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

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
          {flags.search && (
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
          )}
        </CommandList>
        <CommandFooter>
          <SvgLogo className="flex size-6 items-center justify-center" />
          <CommandFooterTrigger triggerKey={<Kbd keys={['enter']} className="py-0" />}>
            {isSelectingCommand ? '打开命令' : '打开链接'}
          </CommandFooterTrigger>
        </CommandFooter>
      </CommandDialog>
    </div>
  )
}

export default CommandMenu

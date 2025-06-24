'use client'

import { useQuery } from '@tanstack/react-query'
import { FileTextIcon, FolderIcon, Search, StickyNoteIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '~/components/base/button'
import { Dialog, DialogContent, DialogTitle } from '~/components/base/dialog'
import { Input } from '~/components/base/input'
import { ScrollArea } from '~/components/base/scroll-area'
import { useDebouncedCallback } from '~/hooks/use-debounced-callback'
import { useTRPC } from '~/trpc/client'
import { SvgLogo } from '../shared/logo'

interface SearchResult {
  id: string
  title: string
  type: 'post' | 'note' | 'project'
  url: string
}

function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const trpc = useTRPC()

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

  const transformedSearchResults: SearchResult[] = useMemo(
    () =>
      searchResults.map(result => ({
        id: result.id,
        title: result.title,
        type: result.type,
        url: result.url,
      })),
    [searchResults],
  )

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query)
    setSelectedIndex(-1)
  }, 300)

  const navigateToResult = useCallback((url: string) => {
    setIsOpen(false)
    window.location.href = url
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(value => !value)
      }
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        window.location.href = '/search'
      }
      if (!isOpen)
        return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i < transformedSearchResults.length - 1 ? i + 1 : 0))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i > 0 ? i - 1 : transformedSearchResults.length - 1))
      }
      if (e.key === 'Enter' && transformedSearchResults[selectedIndex]) {
        e.preventDefault()
        navigateToResult(transformedSearchResults[selectedIndex].url)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, transformedSearchResults, selectedIndex])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

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

  return (
    <div>
      <Button
        variant="ghost"
        className="hover:bg-accent/50 flex size-8 cursor-pointer items-center justify-center rounded-full p-0 duration-200 sm:size-9"
        onClick={() => setIsOpen(true)}
        aria-label="开启搜索"
      >
        <Search className="size-5 sm:size-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DialogContent className="max-w-2xl gap-0 p-0 shadow-lg">
          <DialogTitle />
          <div className="flex items-center border-b pr-10">
            <Input
              ref={inputRef}
              className="h-12 border-transparent p-3 px-4 text-base shadow-none focus-visible:ring-0"
              placeholder="搜索文章、笔记、项目..."
              onChange={e => debouncedSearch(e.target.value)}
            />
          </div>

          <ScrollArea
            onMouseLeave={() => setSelectedIndex(-1)}
            onMouseEnter={() => setSelectedIndex(-1)}
            className="max-h-[60vh] min-h-[200px]"
          >
            {transformedSearchResults.length === 0 && searchQuery.length >= 2 && (
              <div className="text-muted-foreground px-4 py-6 text-center text-sm">
                没有找到相关内容
              </div>
            )}

            {transformedSearchResults.length > 0 && (
              <div>
                {transformedSearchResults.map((result, index) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className={`w-full justify-start rounded-none transition-colors ${
                      index === selectedIndex ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => navigateToResult(result.url)}
                  >
                    {getResultIcon(result.type)}
                    <span className="truncate">{result.title}</span>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="flex items-center border-t px-4 py-3">
            <SvgLogo className="mr-auto size-6" />
            <kbd className="bg-muted pointer-events-none mr-2 hidden rounded border px-1.5 font-mono text-xs font-medium opacity-100 select-none sm:inline-block">
              ↑↓
            </kbd>
            <kbd className="bg-muted pointer-events-none mr-2 hidden rounded border px-1.5 font-mono text-xs font-medium opacity-100 select-none sm:inline-block">
              ↵
            </kbd>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommandMenu

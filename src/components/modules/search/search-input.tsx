'use client'

import { useQuery } from '@tanstack/react-query'
import { SearchIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '~/components/base/button'
import { Input } from '~/components/base/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/base/popover'
import { useDebouncedCallback } from '~/hooks/use-debounced-callback'
import { orpc } from '~/orpc/client'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = '搜索文章、笔记、项目...',
  className,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce the query value
  const debouncedSetQuery = useDebouncedCallback(
    useCallback((query: string) => {
      setDebouncedQuery(query)
    }, []),
    300,
  )

  // Use React Query to fetch suggestions
  const { data: suggestions = [] } = useQuery(
    orpc.search.getSearchSuggestions.queryOptions({
      input: {
        query: debouncedQuery,
        limit: 5,
      },
      enabled: debouncedQuery.length >= 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
  )

  useEffect(() => {
    if (value) {
      debouncedSetQuery(value)
    }
    else {
      setDebouncedQuery('')
    }
  }, [value, debouncedSetQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(newValue.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setIsOpen(false)
    onSearch?.(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsOpen(false)
      onSearch?.(value)
    }
    else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    onChange('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleSearchClick = () => {
    onSearch?.(value)
    setIsOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={isOpen && suggestions.length > 0} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(value.length > 0 && suggestions.length > 0)}
              placeholder={placeholder}
              className="pr-20 pl-10"
            />
            <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-1">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="hover:bg-muted h-6 w-6 p-0"
                >
                  <XIcon className="size-3" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSearchClick}
                className="hover:bg-muted h-6 w-6 p-0"
                disabled={!value.trim()}
              >
                <SearchIcon className="size-3" />
              </Button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="hover:bg-accent w-full px-3 py-2 text-left text-sm transition-colors duration-150"
              >
                <div className="flex items-center gap-2">
                  <SearchIcon className="text-muted-foreground size-3" />
                  <span className="truncate">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

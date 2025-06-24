'use client'

import { FileTextIcon, FolderIcon, StickyNoteIcon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/base/badge'
import { Button } from '~/components/base/button'
import { Skeleton } from '~/components/base/skeleton'
import { SearchResultItem } from './search-result-item'

interface SearchResult {
  id: string
  title: string
  summary?: string
  description?: string
  type: 'post' | 'note' | 'project'
  slug: string
  date: string
  score: number
  url: string
  categories?: string
  categoriesText?: string
  techstack?: string[]
  mood?: string
  weather?: string
  github?: string
  homepage?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isLoading?: boolean
  selectedType: 'all' | 'posts' | 'notes' | 'projects'
  onTypeChangeAction: (type: 'all' | 'posts' | 'notes' | 'projects') => void
}

const typeFilters = [
  { value: 'all', label: '全部', icon: null },
  { value: 'posts', label: '文章', icon: FileTextIcon },
  { value: 'notes', label: '笔记', icon: StickyNoteIcon },
  { value: 'projects', label: '项目', icon: FolderIcon },
] as const

export function SearchResults({
  results,
  query,
  isLoading = false,
  selectedType,
  onTypeChangeAction,
}: SearchResultsProps) {
  const [showAll, setShowAll] = useState(false)

  const displayResults = showAll ? results : results.slice(0, 10)

  const getTypeCount = (type: 'all' | 'posts' | 'notes' | 'projects') => {
    if (type === 'all')
      return results.length
    return results.filter(result => result.type === type.slice(0, -1)).length
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map(filter => (
            <Skeleton key={filter.value} className="h-8 w-16" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-border rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="mt-1 size-4" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground">
          <p className="mb-2 text-lg">开始搜索</p>
          <p className="text-sm">输入关键词搜索文章、笔记和项目</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground">
          <p className="mb-2 text-lg">没有找到结果</p>
          <p className="text-sm">尝试使用不同的关键词或检查拼写</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => {
          const Icon = filter.icon
          const count = getTypeCount(filter.value)
          const isActive = selectedType === filter.value

          return (
            <Button
              key={filter.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChangeAction(filter.value)}
              className="flex items-center gap-1.5"
            >
              {Icon && <Icon className="size-3" />}
              <span>{filter.label}</span>
              <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-1 text-xs">
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {displayResults.map(result => (
          <SearchResultItem key={result.id} result={result} query={query} />
        ))}
      </div>

      {/* Show More Button */}
      {results.length > 10 && !showAll && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            显示更多结果 (
            {results.length - 10}
            {' '}
            个)
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-muted-foreground text-center text-sm">
        找到
        {' '}
        {results.length}
        {' '}
        个结果，搜索关键词: "
        {query}
        "
      </div>
    </div>
  )
}

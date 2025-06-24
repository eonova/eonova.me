'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SearchInput, SearchResults } from '~/components/modules/search'
import PageTitle from '~/components/shared/page-title'
import { useTRPC } from '~/trpc/client'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trpc = useTRPC()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedType, setSelectedType] = useState<'all' | 'posts' | 'notes' | 'projects'>(
    (searchParams.get('type') as 'all' | 'posts' | 'notes' | 'projects') || 'all',
  )

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedType !== 'all') params.set('type', selectedType)

    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search'
    router.replace(newUrl, { scroll: false })
  }, [query, selectedType, router])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear search
      if (e.key === 'Escape' && query) {
        setQuery('')
      }
      // Ctrl+1-4 to switch between types
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            setSelectedType('all')
            break
          case '2':
            e.preventDefault()
            setSelectedType('posts')
            break
          case '3':
            e.preventDefault()
            setSelectedType('notes')
            break
          case '4':
            e.preventDefault()
            setSelectedType('projects')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [query])

  // Search query
  const { data: searchResults = [], isLoading } = useQuery(
    trpc.search.searchContent.queryOptions(
      {
        query,
        type: selectedType,
        limit: 50,
      },
      {
        enabled: query.length >= 2,
      },
    ),
  )

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
  }

  const handleTypeChange = (type: 'all' | 'posts' | 'notes' | 'projects') => {
    setSelectedType(type)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <PageTitle title="搜索" description="搜索文章、笔记和项目内容" />

      <div className="space-y-8">
        {/* Search Input */}
        <div className="mx-auto max-w-2xl">
          <SearchInput
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="搜索文章、笔记、项目..."
            className="w-full"
          />
        </div>

        {/* Search Results */}
        <SearchResults
          results={searchResults}
          query={query}
          isLoading={isLoading}
          selectedType={selectedType}
          onTypeChangeAction={handleTypeChange}
        />
      </div>
    </div>
  )
}

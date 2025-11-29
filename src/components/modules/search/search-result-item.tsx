import { CalendarIcon, FileTextIcon, FolderIcon, StickyNoteIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '~/components/base/badge'
import { formatDate } from '~/utils/format-date'

interface SearchResultItemProps {
  result: {
    id: string
    title: string
    summary?: string
    description?: string
    type: 'post' | 'note' | 'project'
    slug: string
    dateCreated: string
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
  query: string
}

function getTypeIcon(type: 'post' | 'note' | 'project') {
  switch (type) {
    case 'post':
      return <FileTextIcon className="size-4" />
    case 'note':
      return <StickyNoteIcon className="size-4" />
    case 'project':
      return <FolderIcon className="size-4" />
  }
}

function getTypeLabel(type: 'post' | 'note' | 'project') {
  switch (type) {
    case 'post':
      return '文章'
    case 'note':
      return '笔记'
    case 'project':
      return '项目'
  }
}

function highlightText(text: string, query: string) {
  if (!query)
    return text

  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part)
      ? (
          <mark key={index} className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-800">
            {part}
          </mark>
        )
      : (
          part
        ),
  )
}

export function SearchResultItem({ result, query }: SearchResultItemProps) {
  const displayText = result.summary || result.description || ''

  return (
    <Link
      href={result.url as any}
      className="border-border hover:bg-accent/50 block rounded-lg border p-4 transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0">{getTypeIcon(result.type)}</div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel(result.type)}
            </Badge>
            {result.categories && (
              <Badge variant="outline" className="text-xs">
                {result.categoriesText || result.categories}
              </Badge>
            )}
          </div>

          <h3 className="text-foreground mb-1 line-clamp-1 font-medium">
            {highlightText(result.title, query)}
          </h3>

          {displayText && (
            <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
              {highlightText(displayText, query)}
            </p>
          )}

          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {formatDate(result.dateCreated)}
            </div>

            {result.techstack && result.techstack.length > 0 && (
              <div className="flex items-center gap-1">
                <span>技术栈:</span>
                <span>{result.techstack.slice(0, 3).join(', ')}</span>
                {result.techstack.length > 3 && <span>...</span>}
              </div>
            )}

            {result.mood && (
              <div className="flex items-center gap-1">
                <span>心情:</span>
                <span>{result.mood}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

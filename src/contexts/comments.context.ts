import type { ListCommentsInput } from '~/orpc/routers'

import { createContext, use } from 'react'

interface CommentsContextValue {
  slug: string
  sort: ListCommentsInput['sort']
  setSort: (sort: ListCommentsInput['sort']) => void
  contentType: 'posts' | 'notes' | 'talks'
}

const CommentsContext = createContext<CommentsContextValue | null>(null)
CommentsContext.displayName = 'CommentsContext'

export function useCommentsContext(): CommentsContextValue {
  const context = use(CommentsContext)

  if (!context) {
    throw new Error('useCommentsContext must be used within a CommentsProvider')
  }

  return context
}

export const CommentsProvider = CommentsContext.Provider

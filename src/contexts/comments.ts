import type { GetInfiniteCommentsInput } from '~/trpc/routers/comments'

import { createContext, use } from 'react'

interface CommentsContext {
  slug: string
  sort: GetInfiniteCommentsInput['sort']
  setSort: (sort: GetInfiniteCommentsInput['sort']) => void
  type: 'post' | 'note' | 'talk'
}

const Context = createContext<CommentsContext | undefined>(undefined)
Context.displayName = 'CommentsContext'

export function useCommentsContext() {
  const context = use(Context)

  if (!context) {
    throw new Error('useCommentsContext must be used within a CommentsProvider')
  }

  return context
}

export const CommentsProvider = Context.Provider

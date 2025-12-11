import type { Post } from '~/lib/content'

import { createContext, use } from 'react'

type PostContext = Post

const Context = createContext<PostContext | undefined>(undefined)
Context.displayName = 'PostContext'

export function usePostContext() {
  const context = use(Context)

  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider')
  }

  return context
}

export const PostProvider = Context.Provider

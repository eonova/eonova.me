import { createContext, use } from 'react'

const Context = createContext<string | undefined>(undefined)
Context.displayName = 'TalkContext'

export function useTalkContext() {
  const context = use(Context)

  if (!context) {
    throw new Error('useTalkContext must be used within a TalkProvider')
  }

  return context
}

export const TalkProvider = Context.Provider

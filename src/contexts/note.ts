import type { Note } from '~/lib/content'

import { createContext, use } from 'react'

type NoteContext = Note

const Context = createContext<NoteContext | undefined>(undefined)
Context.displayName = 'NoteContext'

export function useNoteContext() {
  const context = use(Context)

  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider')
  }

  return context
}

export const NoteProvider = Context.Provider

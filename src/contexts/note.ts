import type { Note } from 'content-collections'

import { createContext, useContext } from 'react'

type NoteContext = Note

const Context = createContext<NoteContext | undefined>(undefined)

export function useNoteContext() {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider')
  }

  return context
}

export const NoteProvider = Context.Provider

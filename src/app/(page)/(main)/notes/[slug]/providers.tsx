'use client'

import type { Note } from 'content-collections'
import { NoteProvider } from '~/contexts/note'

interface ProvidersProps {
  children: React.ReactNode
  note: Note
}

function Providers(props: ProvidersProps) {
  const { children, note } = props

  return <NoteProvider value={note}>{children}</NoteProvider>
}

export default Providers

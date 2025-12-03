'use client'

import { createContext, use, useMemo, useState } from 'react'

interface TalkContextValue {
  isOpenCommentDialog: boolean
  setIsOpenCommentDialog: (open: boolean) => void
}

const TalkContext = createContext<TalkContextValue | null>(null)

export function TalkProvider({ children }: { children: React.ReactNode }) {
  const [isOpenCommentDialog, setIsOpenCommentDialog] = useState(false)

  const value = useMemo(() => ({ isOpenCommentDialog, setIsOpenCommentDialog }), [isOpenCommentDialog])

  return <TalkContext value={value}>{children}</TalkContext>
}

export function useTalk() {
  const ctx = use(TalkContext)
  if (!ctx)
    throw new Error('useTalk must be used within TalkProvider')
  return ctx
}

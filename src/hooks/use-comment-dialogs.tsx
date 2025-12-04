'use client'

import type { ListAllCommentsOutput } from '~/orpc/routers'
import { createContext, use, useMemo, useState } from 'react'

type Comment = ListAllCommentsOutput['comments'][number]

interface CommentDialogsContextValue {
  currentComment: Comment | null
  deleteDialog: boolean
  setDeleteDialogs: (open: boolean) => void
  setCurrentComment: (comment: Comment | null) => void
}

const CommentDialogsContext = createContext<CommentDialogsContextValue | null>(null)

export function CommentDialogsProvider({ children }: { children: React.ReactNode }) {
  const [currentComment, setCurrentComment] = useState<Comment | null>(null)
  const [deleteDialog, setDeleteDialogs] = useState(false)

  const value = useMemo(
    () => ({
      currentComment,
      deleteDialog,
      setDeleteDialogs,
      setCurrentComment,
    }),
    [currentComment, deleteDialog],
  )

  return <CommentDialogsContext value={value}>{children}</CommentDialogsContext>
}

export function useCommentDialogs() {
  const ctx = use(CommentDialogsContext)
  if (!ctx)
    throw new Error('useCommentDialogs must be used within CommentDialogsProvider')
  return ctx
}

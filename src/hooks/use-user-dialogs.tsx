'use client'

import type { ListAllUsersOutput } from '~/orpc/routers'
import { createContext, use, useMemo, useState } from 'react'

type User = ListAllUsersOutput['users'][number]

interface UserDialogsContextValue {
  currentUser: User | null
  updateDialog: boolean
  deleteDialog: boolean
  setUpdateDialogs: (open: boolean) => void
  setDeleteDialogs: (open: boolean) => void
  setCurrentUser: (user: User | null) => void
}

const UserDialogsContext = createContext<UserDialogsContextValue | null>(null)

export function UserDialogsProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [updateDialog, setUpdateDialogs] = useState(false)
  const [deleteDialog, setDeleteDialogs] = useState(false)

  const value = useMemo(
    () => ({
      currentUser,
      updateDialog,
      deleteDialog,
      setUpdateDialogs,
      setDeleteDialogs,
      setCurrentUser,
    }),
    [currentUser, updateDialog, deleteDialog],
  )

  return <UserDialogsContext value={value}>{children}</UserDialogsContext>
}

export function useUserDialogs() {
  const ctx = use(UserDialogsContext)
  if (!ctx)
    throw new Error('useUserDialogs must be used within UserDialogsProvider')
  return ctx
}

'use client'

import type { ListAllFriendsOutput } from '~/orpc/routers'
import { createContext, use, useMemo, useState } from 'react'

type Friend = ListAllFriendsOutput['friends'][number]

interface FriendDialogsContextValue {
  currentFriend: Friend | null
  addDialog: boolean
  updateDialog: boolean
  deleteDialog: boolean
  setAddDialogs: (open: boolean) => void
  setUpdateDialogs: (open: boolean) => void
  setDeleteDialogs: (open: boolean) => void
  setCurrentFriend: (friend: Friend | null) => void
}

const FriendDialogsContext = createContext<FriendDialogsContextValue | null>(null)

export function FriendDialogsProvider({ children }: { children: React.ReactNode }) {
  const [currentFriend, setCurrentFriend] = useState<Friend | null>(null)
  const [addDialog, setAddDialogs] = useState(false)
  const [updateDialog, setUpdateDialogs] = useState(false)
  const [deleteDialog, setDeleteDialogs] = useState(false)

  const value = useMemo(
    () => ({
      currentFriend,
      addDialog,
      updateDialog,
      deleteDialog,
      setAddDialogs,
      setUpdateDialogs,
      setDeleteDialogs,
      setCurrentFriend,
    }),
    [currentFriend, addDialog, updateDialog, deleteDialog],
  )

  return <FriendDialogsContext value={value}>{children}</FriendDialogsContext>
}

export function useFriendDialogs() {
  const ctx = use(FriendDialogsContext)
  if (!ctx)
    throw new Error('useFriendDialogs must be used within FriendDialogsProvider')
  return ctx
}

export function useSafeFriendDialogs() {
  return use(FriendDialogsContext)
}

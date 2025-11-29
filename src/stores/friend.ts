import type { ListAllFriendsOutput } from '~/orpc/routers'
import { create } from 'zustand'

type Friend = ListAllFriendsOutput['friends'][number]

interface FriendDialogsStore {
  currentFriend: Friend | null
  addDialog: boolean
  updateDialog: boolean
  deleteDialog: boolean
  setAddDialogs: (open: boolean) => void
  setUpdateDialogs: (open: boolean) => void
  setDeleteDialogs: (open: boolean) => void
  setCurrentFriend: (friend: Friend | null) => void
}

export const useFriendDialogsStore = create<FriendDialogsStore>(set => ({
  currentFriend: null,
  addDialog: false,
  updateDialog: false,
  deleteDialog: false,
  setAddDialogs: open => set({ addDialog: open }),
  setUpdateDialogs: open => set({ updateDialog: open }),
  setDeleteDialogs: open => set({ deleteDialog: open }),
  setCurrentFriend: friend => set({ currentFriend: friend }),
}))

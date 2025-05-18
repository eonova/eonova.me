import { create } from 'zustand'

interface FriendDialogsStore {
  addDialog: boolean
  updateDialog: boolean
  deleteDialog: boolean
  setAddDialogs: (open: boolean) => void
  setUpdateDialogs: (open: boolean) => void
  setDeleteDialogs: (open: boolean) => void
}

export const useFriendDialogsStore = create<FriendDialogsStore>(set => ({
  addDialog: false,
  updateDialog: false,
  deleteDialog: false,
  setAddDialogs: open => set({ addDialog: open }),
  setUpdateDialogs: open => set({ updateDialog: open }),
  setDeleteDialogs: open => set({ deleteDialog: open }),
}))

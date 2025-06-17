import { create } from 'zustand'

interface TalkState {
  isOpenCommentDialog: boolean
  setIsOpenCommentDialog: (open: boolean) => void
}

export const useTalkStore = create<TalkState>(set => ({
  isOpenCommentDialog: false,
  setIsOpenCommentDialog: (open: boolean) => set({ isOpenCommentDialog: open }),
}))

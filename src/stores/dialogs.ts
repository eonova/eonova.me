import { create } from 'zustand'

interface DialogsState {
  isSignInOpen: boolean
  setIsSignInOpen: (value: boolean) => void
}

export const useDialogsStore = create<DialogsState>(set => ({
  isSignInOpen: false,
  setIsSignInOpen: (value: boolean) =>
    set({
      isSignInOpen: value,
    }),
}))

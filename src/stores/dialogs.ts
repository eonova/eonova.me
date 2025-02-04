import { create } from 'zustand'

interface DialogsState {
  signIn: boolean
  setDialogs: (value: boolean) => void
}

export const useDialogsStore = create<DialogsState>(set => ({
  signIn: false,
  setDialogs: (value: boolean) => set({
    signIn: value,
  }),
}))

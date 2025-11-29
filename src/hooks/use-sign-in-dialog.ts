import { create } from 'zustand'

interface SignInDialogState {
  open: boolean
  setOpen: (open: boolean) => void
  openDialog: () => void
  closeDialog: () => void
}

export const useSignInDialog = create<SignInDialogState>(set => ({
  open: false,
  setOpen: open => set({ open }),
  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),
}))

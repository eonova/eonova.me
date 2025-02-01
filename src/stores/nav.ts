import { create } from 'zustand'

interface NavState {
  isVisible: boolean
  setIsVisible: () => void
}

export const useNav = create<NavState>(set => ({
  isVisible: false,
  setIsVisible: () => set(store => ({ isVisible: !store.isVisible })),
}))

import { create } from 'zustand'

interface MusicPlayStore {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

const useMusicPlayStore = create<MusicPlayStore>(set => ({
  isPlaying: false,
  setIsPlaying: playing => set({ isPlaying: playing }),
}))

export function useMusicPlay() {
  const { isPlaying, setIsPlaying } = useMusicPlayStore()
  return { isPlaying, setIsPlaying }
}

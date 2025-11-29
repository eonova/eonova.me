import { create } from 'zustand'

interface MusicToastState {
  visible: boolean
  songName: string
  artist: string
  duration: number
}

interface MusicToastActions {
  show: (params: { songName: string, artist: string, duration?: number }) => void
  hide: () => void
}

const useMusicToastStore = create<MusicToastState & MusicToastActions>(set => ({
  visible: false,
  songName: '',
  artist: '',
  duration: 2000,
  show: ({ songName, artist, duration = 2000 }) => {
    console.log('show', songName, artist, duration)
    set({
      visible: true,
      songName,
      artist,
      duration,
    })
  },
  hide: () => set({ visible: false }),
}))

export function useMusicToast() {
  return useMusicToastStore()
}

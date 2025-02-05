import { create } from 'zustand'

interface DirImageStore {
  dirList: string[]
  imageList: any[]
  addDir: (dir: string) => void
  addImage: (image: any) => void
  clear: () => void
}

export const useDirImageStore = create<DirImageStore>(set => ({
  dirList: [],
  imageList: [],
  addDir: (dir: string) => set(state => ({ dirList: [...state.dirList, dir] })),
  addImage: (image: any) => set(state => ({ imageList: [...state.imageList, image] })),
  clear: () => set({ dirList: [], imageList: [] }),
}))

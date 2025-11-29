import type { ListAllAlbumOutput } from '~/orpc/routers'
import { create } from 'zustand'

type Image = ListAllAlbumOutput['album'][number]

interface AlbumDialogsState {
  AllImages: Image[]
  currentImage: Image | null
  addDialog: boolean
  setAddDialogs: (value: boolean) => void
  updateDialog: boolean
  setUpdateDialogs: (value: boolean) => void
  deleteDialog: boolean
  setDeleteDialogs: (value: boolean) => void
  setAllImages: (value: Image[]) => void
  setCurrentImage: (value: Image | null) => void
}

export const useAlbumDialogsStore = create<AlbumDialogsState>(set => ({
  AllImages: [],
  currentImage: null,
  addDialog: false,
  setAddDialogs: (value: boolean) =>
    set({
      addDialog: value,
    }),
  updateDialog: false,
  setUpdateDialogs: (value: boolean) =>
    set({
      updateDialog: value,
    }),
  deleteDialog: false,
  setDeleteDialogs: (value: boolean) =>
    set({
      deleteDialog: value,
    }),
  setAllImages: (value: Image[]) =>
    set({
      AllImages: value,
    }),
  setCurrentImage: (value: Image | null) =>
    set({
      currentImage: value,
    }),
}))

import type { GetUsersOutput } from '~/trpc/routers/album'
import { create } from 'zustand'
import { toast } from '~/components/base'

import { api } from '~/trpc/react'

type Image = GetUsersOutput['images'][number]

interface AlbumDialogsState {
  AllImages: Image[]
  addDialog: boolean
  setAddDialogs: (value: boolean) => void
  updateDialog: boolean
  setUpdateDialogs: (value: boolean) => void
  deleteDialog: boolean
  setDeleteDialogs: (value: boolean) => void
  setAllImages: (value: Image[]) => void
  updateAllImages: () => void
}

export const useAlbumDialogsStore = create<AlbumDialogsState>(set => ({
  AllImages: [],
  addDialog: false,
  setAddDialogs: (value: boolean) => set({
    addDialog: value,
  }),
  updateDialog: false,
  setUpdateDialogs: (value: boolean) => set({
    updateDialog: value,
  }),
  deleteDialog: false,
  setDeleteDialogs: (value: boolean) => set({
    deleteDialog: value,
  }),
  setAllImages: (value: Image[]) => set({
    AllImages: value,
  }),
  updateAllImages: () => {
    const { status, data } = api.album.getAllImages.useQuery()
    if (status === 'success') {
      set({ AllImages: data?.images || [] })
    }
    else {
      toast.error('更新数据失败')
    }
    return data
  },
}))

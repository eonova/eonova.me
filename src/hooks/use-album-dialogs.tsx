'use client'

import type { ListAllAlbumOutput } from '~/orpc/routers'
import { createContext, use, useMemo, useState } from 'react'

type Image = ListAllAlbumOutput['album'][number]

interface AlbumDialogsContextValue {
  AllImages: Image[]
  currentImage: Image | null
  addDialog: boolean
  updateDialog: boolean
  deleteDialog: boolean
  setAddDialogs: (open: boolean) => void
  setUpdateDialogs: (open: boolean) => void
  setDeleteDialogs: (open: boolean) => void
  setAllImages: (images: Image[]) => void
  setCurrentImage: (image: Image | null) => void
}

const AlbumDialogsContext = createContext<AlbumDialogsContextValue | null>(null)

export function AlbumDialogsProvider({ children }: { children: React.ReactNode }) {
  const [AllImages, setAllImages] = useState<Image[]>([])
  const [currentImage, setCurrentImage] = useState<Image | null>(null)
  const [addDialog, setAddDialogs] = useState(false)
  const [updateDialog, setUpdateDialogs] = useState(false)
  const [deleteDialog, setDeleteDialogs] = useState(false)

  const value = useMemo(
    () => ({
      AllImages,
      currentImage,
      addDialog,
      updateDialog,
      deleteDialog,
      setAddDialogs,
      setUpdateDialogs,
      setDeleteDialogs,
      setAllImages,
      setCurrentImage,
    }),
    [AllImages, currentImage, addDialog, updateDialog, deleteDialog],
  )

  return <AlbumDialogsContext value={value}>{children}</AlbumDialogsContext>
}

export function useAlbumDialogs() {
  const ctx = use(AlbumDialogsContext)
  if (!ctx)
    throw new Error('useAlbumDialogs must be used within AlbumDialogsProvider')
  return ctx
}

'use client'

import { createContext, use, useCallback, useMemo, useState } from 'react'

interface NavContextValue {
  isVisible: boolean
  setIsVisible: () => void
}

const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setVisible] = useState(false)

  const setIsVisible = useCallback(() => {
    setVisible(prev => !prev)
  }, [])

  const value = useMemo(() => ({ isVisible, setIsVisible }), [isVisible, setIsVisible])

  return <NavContext value={value}>{children}</NavContext>
}

export function useNav() {
  const ctx = use(NavContext)
  if (!ctx)
    throw new Error('useNav must be used within NavProvider')
  return ctx
}

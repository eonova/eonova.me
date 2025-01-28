import type { ReactNode } from 'react'
import React, { createContext, useContext, useState } from 'react'

interface CardContextType {
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
}

const CardContext = createContext<CardContextType | undefined>(undefined)

export function CardProvider({ children }: { children: ReactNode }) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  return (
    <CardContext value={{ selectedCardId, setSelectedCardId }}>
      {children}
    </CardContext>
  )
}

export function useCardContext() {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider')
  }
  return context
}

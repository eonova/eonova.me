import { createContext, useContext } from 'react'

interface RatesContext {
  increment: () => void
  decrement: () => void
  getCount: () => number
}

const Context = createContext<RatesContext | undefined>(undefined)

export function useRatesContext() {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useRatesContext must be used within a RatesProvider')
  }

  return context
}

export const RatesProvider = Context.Provider

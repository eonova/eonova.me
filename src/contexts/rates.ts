import { createContext, use } from 'react'

interface RatesContext {
  increment: () => void
  decrement: () => void
  getCount: () => number
}

const Context = createContext<RatesContext | undefined>(undefined)
Context.displayName = 'RatesContext'

export function useRatesContext() {
  const context = use(Context)

  if (!context) {
    throw new Error('useRatesContext must be used within a RatesProvider')
  }

  return context
}

export const RatesProvider = Context.Provider

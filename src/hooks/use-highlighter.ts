import type { HighlighterCore } from 'shiki'
import { create } from 'zustand'

interface HighlighterState {
  highlighter: HighlighterCore | null
  setHighlighter: (h: HighlighterCore | null) => void
}

const useHighlighterStore = create<HighlighterState>(set => ({
  highlighter: null,
  setHighlighter: h => set({ highlighter: h }),
}))

export function useHighlighter(): readonly [HighlighterCore | null, (h: HighlighterCore | null) => void] {
  const highlighter = useHighlighterStore(s => s.highlighter)
  const setHighlighter = useHighlighterStore(s => s.setHighlighter)
  return [highlighter, setHighlighter] as const
}

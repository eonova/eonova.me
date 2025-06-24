import { describe, expect, it } from 'vitest'

// Test the search logic functions directly
function fuzzySearch(query: string, text: string): number {
  // Handle empty query
  if (!query || query.length === 0) {
    return 0
  }

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return 100
  }

  // Character-by-character fuzzy matching
  let queryIndex = 0

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }

  // Return percentage of query characters found
  return (queryIndex / queryLower.length) * 50
}

function calculateScore(query: string, item: any, _type: 'post' | 'note' | 'project'): number {
  const titleScore = fuzzySearch(query, item.title || item.name || '') * 3
  const summaryScore = item.summary ? fuzzySearch(query, item.summary) * 2 : 0
  const contentScore = item.content ? fuzzySearch(query, item.content) * 1 : 0
  const descriptionScore = item.description ? fuzzySearch(query, item.description) * 2 : 0

  return titleScore + summaryScore + contentScore + descriptionScore
}

describe('search Functions', () => {
  describe('fuzzySearch', () => {
    it('should return high score for exact matches', () => {
      const score = fuzzySearch('React', 'React is awesome')
      expect(score).toBe(100)
    })

    it('should return lower score for partial matches', () => {
      const score = fuzzySearch('React', 'JavaScript library')
      expect(score).toBeLessThan(100)
    })

    it('should be case insensitive', () => {
      const score1 = fuzzySearch('react', 'React is awesome')
      const score2 = fuzzySearch('REACT', 'react is awesome')
      expect(score1).toBe(100)
      expect(score2).toBe(100)
    })

    it('should handle empty strings', () => {
      const score = fuzzySearch('', 'some text')
      expect(score).toBe(0)
    })
  })

  describe('calculateScore', () => {
    it('should weight title matches higher', () => {
      const item = {
        title: 'React Guide',
        summary: 'A guide',
        content: 'Some content',
      }

      const score = calculateScore('React', item, 'post')
      expect(score).toBeGreaterThanOrEqual(300) // Title match * 3 = 100 * 3 = 300
    })

    it('should include summary and content scores', () => {
      const item = {
        title: 'Guide',
        summary: 'React summary',
        content: 'React content',
      }

      const score = calculateScore('React', item, 'post')
      expect(score).toBeGreaterThan(200) // Summary * 2 + Content * 1
    })

    it('should handle missing fields gracefully', () => {
      const item = {
        title: 'React Guide',
      }

      const score = calculateScore('React', item, 'post')
      expect(score).toBeGreaterThan(0)
    })

    it('should work with project items', () => {
      const item = {
        name: 'React Project',
        description: 'A React project',
        content: 'Project content',
      }

      const score = calculateScore('React', item, 'project')
      expect(score).toBeGreaterThan(0)
    })
  })
})

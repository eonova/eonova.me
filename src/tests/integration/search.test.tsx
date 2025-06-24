import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { searchRouter } from '~/trpc/routers/search'

// Mock the database and session for tRPC context
const mockContext = {
  db: {} as any, // Mock database - not used by search router
  session: null, // Mock session - not used by search router
  headers: new Headers() as any, // Mock headers - not used by search router
}

describe('searchIntegrationTests', () => {
  beforeEach(() => {
    // Create a new QueryClient for each test to ensure isolation
    // eslint-disable-next-line no-new
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  describe('searchRouterIntegration', () => {
    it('should perform end-to-end search across all content types', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'React',
        type: 'all',
        limit: 10,
      })

      // Should find React-related content in posts and projects
      expect(result.length).toBeGreaterThan(0)

      const reactPost = result.find(r => r.title.includes('React Hooks'))
      const reactProject = result.find(r => r.title.includes('React Component'))

      expect(reactPost).toBeDefined()
      expect(reactProject).toBeDefined()

      // Verify proper scoring (exact matches should score higher)
      expect(reactPost?.score).toBeGreaterThan(50)
      expect(reactProject?.score).toBeGreaterThan(50)
    })

    it('should handle complex search queries', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'JavaScript async',
        type: 'all',
        limit: 10,
      })

      const asyncPost = result.find(r => r.title.includes('JavaScript Async'))
      expect(asyncPost).toBeDefined()
      expect(asyncPost?.type).toBe('post')
    })

    it('should filter by content type correctly', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const postsOnly = await caller.searchContent({
        query: 'programming',
        type: 'posts',
        limit: 10,
      })

      const notesOnly = await caller.searchContent({
        query: 'programming',
        type: 'notes',
        limit: 10,
      })

      expect(postsOnly.every(r => r.type === 'post')).toBe(true)
      expect(notesOnly.every(r => r.type === 'note')).toBe(true)
    })

    it('should provide relevant suggestions', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const suggestions = await caller.getSearchSuggestions({
        query: 'React',
        limit: 5,
      })

      expect(suggestions).toContain('Complete Guide to React Hooks')
      expect(suggestions).toContain('React Component Library')
      expect(suggestions.length).toBeLessThanOrEqual(5)
    })

    it('should handle edge cases gracefully', async () => {
      const caller = searchRouter.createCaller(mockContext)

      // Empty query should return empty results
      const emptyResult = await caller.searchContent({
        query: '',
        type: 'all',
        limit: 10,
      })
      expect(emptyResult).toHaveLength(0)

      // Non-existent content should return very few or no results
      const noResults = await caller.searchContent({
        query: 'nonexistentcontent12345',
        type: 'all',
        limit: 10,
      })
      // With fuzzy matching, we might get some low-score results, but they should be minimal
      expect(noResults.length).toBeLessThanOrEqual(3)
      // And any results should have very low scores
      noResults.forEach((result) => {
        expect(result.score).toBeLessThan(50)
      })

      // Very long query should still work
      const longQuery = 'a'.repeat(1000)
      const longQueryResult = await caller.searchContent({
        query: longQuery,
        type: 'all',
        limit: 10,
      })
      expect(Array.isArray(longQueryResult)).toBe(true)
    })
  })

  describe('search Scoring and Ranking', () => {
    it('should rank exact title matches highest', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'Complete Guide to React Hooks',
        type: 'all',
        limit: 10,
      })

      expect(result[0]?.title).toBe('Complete Guide to React Hooks')
      expect(result[0]?.score).toBeGreaterThan(200) // High score for exact match
    })

    it('should rank partial matches appropriately', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'React Hooks',
        type: 'all',
        limit: 10,
      })

      const hookPost = result.find(r => r.title.includes('React Hooks'))
      expect(hookPost?.score).toBeGreaterThan(100)
    })

    it('should consider content relevance in scoring', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'TypeScript',
        type: 'all',
        limit: 10,
      })

      // Project with TypeScript in techstack should be found
      const tsProject = result.find(r => r.techstack?.includes('TypeScript'))
      expect(tsProject).toBeDefined()
    })
  })

  describe('search Performance', () => {
    it('should complete searches within reasonable time', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const startTime = Date.now()

      await caller.searchContent({
        query: 'React JavaScript TypeScript',
        type: 'all',
        limit: 50,
      })

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete within 1 second
      expect(duration).toBeLessThan(1000)
    })

    it('should handle concurrent searches', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const searches = [
        caller.searchContent({ query: 'React', type: 'all', limit: 10 }),
        caller.searchContent({ query: 'JavaScript', type: 'all', limit: 10 }),
        caller.searchContent({ query: 'TypeScript', type: 'all', limit: 10 }),
      ]

      const results = await Promise.all(searches)

      expect(results).toHaveLength(3)
      results.forEach((result) => {
        expect(Array.isArray(result)).toBe(true)
      })
    })
  })

  describe('search Data Integrity', () => {
    it('should return consistent URL formats', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'React',
        type: 'all',
        limit: 10,
      })

      result.forEach((item) => {
        expect(item.url).toMatch(/^\/\w+\/[\w-]+$/)

        switch (item.type) {
          case 'post':
            expect(item.url).toMatch(/^\/posts\//)
            break
          case 'note':
            expect(item.url).toMatch('/notes/')
            break
          case 'project':
            expect(item.url).toMatch('/projects/')
            break
        }
      })
    })

    it('should include all required metadata for each content type', async () => {
      const caller = searchRouter.createCaller(mockContext)

      const result = await caller.searchContent({
        query: 'a', // Broad query to get all types
        type: 'all',
        limit: 10,
      })

      const post = result.find(r => r.type === 'post')
      const note = result.find(r => r.type === 'note')
      const project = result.find(r => r.type === 'project')

      if (post) {
        expect(post).toHaveProperty('categories')
        expect(post).toHaveProperty('categoriesText')
        expect(post).toHaveProperty('summary')
      }

      if (note) {
        expect(note).toHaveProperty('mood')
        expect(note).toHaveProperty('weather')
      }

      if (project) {
        expect(project).toHaveProperty('techstack')
        expect(project).toHaveProperty('github')
        expect(project).toHaveProperty('description')
      }
    })
  })
})

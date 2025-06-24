import { allNotes, allPosts, allProjects } from 'content-collections'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../init'

// Simple fuzzy search function
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

// Search scoring function
function calculateScore(query: string, item: any, _type: 'post' | 'note' | 'project'): number {
  const titleScore = fuzzySearch(query, item.title || item.name || '') * 3 // Title matches are more important
  const summaryScore = item.summary ? fuzzySearch(query, item.summary) * 2 : 0
  const contentScore = item.content ? fuzzySearch(query, item.content) * 1 : 0
  const descriptionScore = item.description ? fuzzySearch(query, item.description) * 2 : 0

  return titleScore + summaryScore + contentScore + descriptionScore
}

export const searchRouter = createTRPCRouter({
  searchContent: publicProcedure
    .input(
      z.object({
        query: z.string(),
        type: z.enum(['all', 'posts', 'notes', 'projects']).default('all'),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      const { query, type, limit } = input

      // Return empty results for empty query
      if (!query || query.trim().length === 0) {
        return []
      }

      const results: Array<{
        id: string
        title: string
        summary?: string
        description?: string
        type: 'post' | 'note' | 'project'
        slug: string
        date: string
        score: number
        url: string
        categories?: string
        categoriesText?: string
        techstack?: string[]
        mood?: string
        weather?: string
        github?: string
        homepage?: string
      }> = []

      // Search posts
      if (type === 'all' || type === 'posts') {
        for (const post of allPosts) {
          const score = calculateScore(query, post, 'post')
          if (score > 10) {
            // Minimum threshold
            results.push({
              id: post.slug,
              title: post.title,
              summary: post.summary,
              type: 'post',
              slug: post.slug,
              date: post.date,
              score,
              url: `/posts/${post.slug}`,
              categories: post.categories,
              categoriesText: post.categoriesText,
            })
          }
        }
      }

      // Search notes
      if (type === 'all' || type === 'notes') {
        for (const note of allNotes) {
          const score = calculateScore(query, note, 'note')
          if (score > 10) {
            results.push({
              id: note.slug,
              title: note.title,
              summary: note.summary,
              type: 'note',
              slug: note.slug,
              date: note.date,
              score,
              url: `/notes/${note.slug}`,
              mood: note.mood,
              weather: note.weather,
            })
          }
        }
      }

      // Search projects
      if (type === 'all' || type === 'projects') {
        for (const project of allProjects) {
          const score = calculateScore(query, project, 'project')
          if (score > 10) {
            results.push({
              id: project.slug,
              title: project.name,
              description: project.description,
              type: 'project',
              slug: project.slug,
              date: project.date,
              score,
              url: `/projects/${project.slug}`,
              techstack: project.techstack,
              github: project.github,
              homepage: project.homepage,
            })
          }
        }
      }

      // Sort by score and limit results
      return results.sort((a, b) => b.score - a.score).slice(0, limit)
    }),

  getSearchSuggestions: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(10).default(5),
      }),
    )
    .query(async ({ input }) => {
      const { query, limit } = input
      const suggestions: string[] = []

      // Get title suggestions from all content
      const allContent = [
        ...allPosts.map((p) => p.title),
        ...allNotes.map((n) => n.title),
        ...allProjects.map((p) => p.name),
      ]

      for (const title of allContent) {
        if (title.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(title)) {
          suggestions.push(title)
          if (suggestions.length >= limit) break
        }
      }

      return suggestions
    }),
})

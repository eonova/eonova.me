import { allNotes, allPages, allPosts, allProjects } from 'content-collections'

export function getLatestPosts(limit: number = allPosts.length) {
  return allPosts
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
}

export function getLatestProjects(limit: number = allProjects.length) {
  return allProjects
    .toSorted((a, b) => {
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    })
    .slice(0, limit)
}

export function getSelectedProjects() {
  return allProjects.filter(project => project.selected)
}

export function getNoteBySlug(slug: string) {
  return allNotes.find(p => p.slug === slug)
}

export function getPostBySlug(slug: string) {
  return allPosts.find(p => p.slug === slug)
}

export function getProjectBySlug(slug: string) {
  return allProjects.find(p => p.slug === slug)
}

export function getPageBySlug(slug: string) {
  return allPages.find(p => p.slug === slug)
}

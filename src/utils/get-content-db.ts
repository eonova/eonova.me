import { notes, posts, talks } from '~/db'

export function getContent(contentType: 'posts' | 'notes' | 'talks') {
  switch (contentType) {
    case 'posts':
      return posts.slug
    case 'notes':
      return notes.title
    case 'talks':
      return talks.id
  }
}

export function getContentDB(contentType: 'posts' | 'notes' | 'talks') {
  switch (contentType) {
    case 'posts':
      return posts
    case 'notes':
      return notes
    case 'talks':
      return talks
  }
}

import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock environment variables
vi.mock('~/env', () => ({
  env: {
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NODE_ENV: 'test',
    NEXTAUTH_SECRET: 'test-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
    GOOGLE_CLIENT_ID: 'test-google-client-id',
    GOOGLE_CLIENT_SECRET: 'test-google-client-secret',
    UPSTASH_REDIS_REST_URL: 'http://localhost:6379',
    UPSTASH_REDIS_REST_TOKEN: 'test-token',
  },
}))

// Mock database
vi.mock('~/db', () => ({
  db: {
    query: vi.fn(),
    transaction: vi.fn(),
  },
}))

// Mock auth
vi.mock('~/lib/auth', () => ({
  authConfig: {
    providers: [],
    socialProviders: {
      google: {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      },
    },
  },
}))

// Mock Redis
vi.mock('~/lib/kv', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}))

// Mock cache manager
vi.mock('~/lib/cache-manager', () => ({
  cacheManager: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}))

// Global mock for content-collections
vi.mock('content-collections', () => ({
  allPosts: [
    {
      slug: 'react-hooks-guide',
      title: 'Complete Guide to React Hooks',
      summary: 'Learn everything about React hooks',
      content: 'React hooks are a powerful feature...',
      date: '2024-01-01',
      categories: 'React,JavaScript',
      categoriesText: 'React JavaScript',
    },
    {
      slug: 'javascript-async',
      title: 'JavaScript Async Programming',
      summary: 'Master async/await and promises',
      content: 'Asynchronous programming in JavaScript...',
      date: '2024-01-02',
      categories: 'JavaScript',
      categoriesText: 'JavaScript',
    },
  ],
  allNotes: [
    {
      slug: 'programming-thoughts',
      title: 'Programming Thoughts',
      summary: 'Random thoughts about programming',
      content: 'Today I learned about...',
      date: '2024-01-03',
      mood: 'happy',
      weather: 'sunny',
    },
  ],
  allProjects: [
    {
      slug: 'react-component-lib',
      name: 'React Component Library',
      description: 'A collection of reusable React components',
      content: 'This project contains...',
      date: '2024-01-04',
      techstack: ['React', 'TypeScript'],
      github: 'https://github.com/user/react-lib',
      homepage: 'https://react-lib.com',
    },
  ],
}))

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SearchPage from '~/app/(page)/(main)/search/page'

// Mock Next.js router
const mockPush = vi.fn()
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: vi.fn((key: string) => {
      if (key === 'q') return 'test query'
      if (key === 'type') return 'all'
      return null
    }),
  }),
}))

// Mock tRPC
const mockSearchQuery = vi.fn()
vi.mock('~/trpc/client', () => ({
  useTRPC: () => ({
    search: {
      searchContent: {
        queryOptions: mockSearchQuery,
      },
      getSearchSuggestions: {
        query: vi.fn().mockResolvedValue(['suggestion 1', 'suggestion 2']),
      },
    },
  }),
}))

// Mock useQuery
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: [
        {
          id: '1',
          title: 'Test Result',
          type: 'post',
          slug: 'test-result',
          date: '2024-01-01',
          score: 95,
          url: '/posts/test-result',
          summary: 'Test summary',
        },
      ],
      isLoading: false,
    })),
  }
})

// Mock components
vi.mock('~/components/shared/page-title', () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}))

vi.mock('~/components/modules/search', () => ({
  SearchInput: ({ value, onChange, onSearch }: any) => (
    <div>
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
      />
      <button type="button" onClick={() => onSearch(value)}>
        Search
      </button>
    </div>
  ),
  SearchResults: ({ results, query, selectedType, onTypeChangeAction }: any) => (
    <div>
      <div data-testid="search-results">
        {results.map((result: any) => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
      <div>
        <button type="button" onClick={() => onTypeChangeAction('all')}>
          All
        </button>
        <button type="button" onClick={() => onTypeChangeAction('posts')}>
          Posts
        </button>
        <button type="button" onClick={() => onTypeChangeAction('notes')}>
          Notes
        </button>
        <button type="button" onClick={() => onTypeChangeAction('projects')}>
          Projects
        </button>
      </div>
      <div>
        Query:
        {query}
      </div>
      <div>
        Type:
        {selectedType}
      </div>
    </div>
  ),
}))

// Mock debounced callback
vi.mock('~/hooks/use-debounced-callback', () => ({
  useDebouncedCallback: (fn: any) => fn,
}))

describe('searchPage', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>)
  }

  it('renders search page with title and description', () => {
    renderWithQueryClient(<SearchPage />)

    expect(screen.getByText('搜索')).toBeInTheDocument()
    expect(screen.getByText('搜索文章、笔记和项目内容')).toBeInTheDocument()
  })

  it('initializes with URL parameters', () => {
    renderWithQueryClient(<SearchPage />)

    // Check that the input has the correct value
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument()

    // Check that the mock components are rendered with correct props
    expect(screen.getByTestId('search-results')).toBeInTheDocument()
  })

  it('updates URL when search query changes', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    const input = screen.getByTestId('search-input')
    await user.clear(input)
    await user.type(input, 'new query')

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/search?q=new+query', { scroll: false })
    })
  })

  it('updates URL when type filter changes', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    await user.click(screen.getByText('Posts'))

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/search?q=test+query&type=posts', { scroll: false })
    })
  })

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    // Test Escape to clear search
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument()
    })
  })

  it('handles type switching with Ctrl+number keys', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    // Test Ctrl+2 for posts
    await user.keyboard('{Control>}2{/Control}')

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/search?q=test+query&type=posts', { scroll: false })
    })
  })

  it('displays search results', () => {
    renderWithQueryClient(<SearchPage />)

    expect(screen.getByTestId('search-results')).toBeInTheDocument()
    expect(screen.getByText('Test Result')).toBeInTheDocument()
  })

  it('handles search input submission', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    const input = screen.getByTestId('search-input')
    await user.clear(input)
    await user.type(input, 'search term{Enter}')

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/search?q=search+term', { scroll: false })
    })
  })

  it('handles search button click', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    const input = screen.getByTestId('search-input')
    await user.clear(input)
    await user.type(input, 'button search')

    await user.click(screen.getByText('Search'))

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/search?q=button+search', { scroll: false })
    })
  })

  it('removes type parameter from URL when set to "all"', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SearchPage />)

    // First set to posts
    await user.click(screen.getByText('Posts'))

    // Then back to all
    await user.click(screen.getByText('All'))

    await waitFor(() => {
      expect(mockReplace).toHaveBeenLastCalledWith('/search?q=test+query', { scroll: false })
    })
  })
})

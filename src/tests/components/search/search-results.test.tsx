import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchResults } from '~/components/modules/search/search-results'

// Mock the format-date utility
vi.mock('~/utils/format-date', () => ({
  formatDate: (date: string) => `Formatted: ${date}`,
}))

describe('searchResults', () => {
  const mockResults = [
    {
      id: '1',
      title: 'Test Post',
      summary: 'This is a test post',
      type: 'post' as const,
      slug: 'test-post',
      date: '2024-01-01',
      score: 95,
      url: '/posts/test-post',
      categories: 'tech',
      categoriesText: '技术',
    },
    {
      id: '2',
      title: 'Test Note',
      summary: 'This is a test note',
      type: 'note' as const,
      slug: 'test-note',
      date: '2024-01-02',
      score: 85,
      url: '/notes/test-note',
      mood: '😊',
      weather: '☀️',
    },
    {
      id: '3',
      title: 'Test Project',
      description: 'This is a test project',
      type: 'project' as const,
      slug: 'test-project',
      date: '2024-01-03',
      score: 75,
      url: '/projects/test-project',
      techstack: ['React', 'TypeScript'],
      github: 'https://github.com/user/test-project',
    },
  ]

  const defaultProps = {
    results: mockResults,
    query: 'test',
    isLoading: false,
    selectedType: 'all' as const,
    onTypeChangeAction: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search results', () => {
    render(<SearchResults {...defaultProps} />)

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Test Post'
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Test Note'
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Test Project'
      }),
    ).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<SearchResults {...defaultProps} isLoading />)

    // Should show skeleton loaders - checking for skeleton class instead of testId
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('shows empty state when no query', () => {
    render(<SearchResults {...defaultProps} query="" />)

    expect(screen.getByText('开始搜索')).toBeInTheDocument()
    expect(screen.getByText('输入关键词搜索文章、笔记和项目')).toBeInTheDocument()
  })

  it('shows no results state', () => {
    render(<SearchResults {...defaultProps} results={[]} />)

    expect(screen.getByText('没有找到结果')).toBeInTheDocument()
    expect(screen.getByText('尝试使用不同的关键词或检查拼写')).toBeInTheDocument()
  })

  it('displays type filters with correct counts', () => {
    render(<SearchResults {...defaultProps} />)

    // Use getByRole to target buttons specifically
    expect(screen.getByRole('button', { name: /全部/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /文章/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /笔记/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /项目/ })).toBeInTheDocument()

    // Check counts - use getAllByText since counts appear in multiple places
    expect(screen.getAllByText('3')).toHaveLength(1) // Total count
    expect(screen.getAllByText('1')).toHaveLength(3) // Individual counts for each type
  })

  it('calls onTypeChangeAction when filter is clicked', async () => {
    const user = userEvent.setup()
    const onTypeChangeAction = vi.fn()

    render(<SearchResults {...defaultProps} onTypeChangeAction={onTypeChangeAction} />)

    await user.click(screen.getByRole('button', { name: /文章/ }))

    expect(onTypeChangeAction).toHaveBeenCalledWith('posts')
  })

  it('highlights active filter', () => {
    render(<SearchResults {...defaultProps} selectedType="posts" />)

    const postsButton = screen.getByRole('button', { name: /文章/ })
    // Check for active variant classes that might be used
    expect(postsButton).toHaveClass(/bg-primary|text-primary/)
  })

  it('shows "Show More" button when there are more than 10 results', () => {
    const manyResults = Array.from({ length: 15 }, (_, i) => ({
      ...mockResults[0],
      id: `${i + 1}`,
      title: `Test Post ${i + 1}`,
    })) as typeof mockResults

    render(<SearchResults {...defaultProps} results={manyResults} />)

    expect(screen.getByText(/显示更多结果/)).toBeInTheDocument()
    // Look for the "Show More" button specifically, not the summary text
    expect(
      screen.getByRole('button', { name: /显示更多结果[^\n\r5\u2028\u2029]*5.*个/ }),
    ).toBeInTheDocument()
  })

  it('expands to show all results when "Show More" is clicked', async () => {
    const user = userEvent.setup()
    const manyResults = Array.from({ length: 15 }, (_, i) => ({
      ...mockResults[0],
      id: `${i + 1}`,
      title: `Test Post ${i + 1}`,
    })) as typeof mockResults

    render(<SearchResults {...defaultProps} results={manyResults} />)

    // Initially shows only 10 results - count only the title elements (h3)
    expect(
      screen.getAllByText((_content, element) => {
        return (element?.tagName === 'H3' && element?.textContent?.includes('Test Post')) ?? false
      }),
    ).toHaveLength(10)

    await user.click(screen.getByText(/显示更多结果/))

    // Now shows all 15 results - count only the title elements (h3)
    expect(
      screen.getAllByText((_content, element) => {
        return (element?.tagName === 'H3' && element?.textContent?.includes('Test Post')) ?? false
      }),
    ).toHaveLength(15)
  })

  it('displays results summary', () => {
    render(<SearchResults {...defaultProps} />)

    expect(screen.getByText('找到 3 个结果，搜索关键词: "test"')).toBeInTheDocument()
  })

  it('highlights query text in results', () => {
    render(<SearchResults {...defaultProps} query="Test" />)

    // Should find highlighted text (marked elements)
    const highlightedElements = screen.getAllByText('Test')
    expect(highlightedElements.length).toBeGreaterThan(0)
  })

  it('displays correct metadata for each content type', () => {
    render(<SearchResults {...defaultProps} />)

    // Post metadata
    expect(screen.getByText('技术')).toBeInTheDocument()

    // Note metadata
    expect(screen.getByText('😊')).toBeInTheDocument()

    // Project metadata
    expect(screen.getByText('React, TypeScript')).toBeInTheDocument()
  })

  it('renders result items as links', () => {
    render(<SearchResults {...defaultProps} />)

    const postLink = screen
      .getByText((_content, element) => {
        return element?.textContent === 'Test Post'
      })
      .closest('a')
    const noteLink = screen
      .getByText((_content, element) => {
        return element?.textContent === 'Test Note'
      })
      .closest('a')
    const projectLink = screen
      .getByText((_content, element) => {
        return element?.textContent === 'Test Project'
      })
      .closest('a')

    expect(postLink).toHaveAttribute('href', '/posts/test-post')
    expect(noteLink).toHaveAttribute('href', '/notes/test-note')
    expect(projectLink).toHaveAttribute('href', '/projects/test-project')
  })
})

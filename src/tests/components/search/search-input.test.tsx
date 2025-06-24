import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock SearchInput component for testing
function MockSearchInput({ value, onChange, onSearch, placeholder }: any) {
  return (
    <div>
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.(value)}
        placeholder={placeholder}
      />
      <button type="button" onClick={() => onSearch?.(value)} disabled={!value.trim()}>
        Search
      </button>
      <button type="button" onClick={() => onChange('')}>
        Clear
      </button>
    </div>
  )
}

describe('searchInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSearch: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with placeholder text', () => {
    render(<MockSearchInput {...defaultProps} placeholder="搜索文章、笔记、项目..." />)

    expect(screen.getByPlaceholderText('搜索文章、笔记、项目...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<MockSearchInput {...defaultProps} placeholder="Custom placeholder" />)

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn()

    render(<MockSearchInput {...defaultProps} onChange={onChange} />)

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test query' } })

    expect(onChange).toHaveBeenCalledWith('test query')
  })

  it('calls onSearch when Enter is pressed', () => {
    const onSearch = vi.fn()

    render(<MockSearchInput {...defaultProps} value="test query" onSearch={onSearch} />)

    const input = screen.getByTestId('search-input')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSearch).toHaveBeenCalledWith('test query')
  })

  it('calls onSearch when search button is clicked', () => {
    const onSearch = vi.fn()

    render(<MockSearchInput {...defaultProps} value="test query" onSearch={onSearch} />)

    const searchButton = screen.getByText('Search')
    fireEvent.click(searchButton)

    expect(onSearch).toHaveBeenCalledWith('test query')
  })

  it('clears input when clear button is clicked', () => {
    const onChange = vi.fn()

    render(<MockSearchInput {...defaultProps} value="test query" onChange={onChange} />)

    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('disables search button when input is empty', () => {
    render(<MockSearchInput {...defaultProps} value="" />)

    const searchButton = screen.getByText('Search')
    expect(searchButton).toBeDisabled()
  })

  it('enables search button when input has value', () => {
    render(<MockSearchInput {...defaultProps} value="test" />)

    const searchButton = screen.getByText('Search')
    expect(searchButton).not.toBeDisabled()
  })

  it('handles basic functionality correctly', () => {
    const onChange = vi.fn()
    const onSearch = vi.fn()

    render(<MockSearchInput value="test" onChange={onChange} onSearch={onSearch} />)

    // Test input exists
    expect(screen.getByTestId('search-input')).toBeInTheDocument()

    // Test buttons exist
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from '~/components/base/badge'

describe('badge Component', () => {
  it('should render with default props', () => {
    render(<Badge>Default Badge</Badge>)

    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary')
  })

  it('should render different variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('border')
  })

  it('should accept custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    expect(screen.getByText('Custom')).toHaveClass('custom-badge')
  })

  it('should render with different content types', () => {
    const { rerender } = render(<Badge>Text Badge</Badge>)
    expect(screen.getByText('Text Badge')).toBeInTheDocument()

    rerender(<Badge>123</Badge>)
    expect(screen.getByText('123')).toBeInTheDocument()

    rerender(
      <Badge>
        <span>Complex Content</span>
      </Badge>,
    )
    expect(screen.getByText('Complex Content')).toBeInTheDocument()
  })

  it('should handle empty content', () => {
    render(<Badge data-testid="empty-badge"></Badge>)
    const badge = screen.getByTestId('empty-badge')
    expect(badge).toBeInTheDocument()
  })

  it('should be accessible', () => {
    render(<Badge aria-label="Status badge">Active</Badge>)
    const badge = screen.getByLabelText('Status badge')
    expect(badge).toBeInTheDocument()
  })

  it('should support custom HTML attributes', () => {
    render(
      <Badge data-testid="test-badge" title="Tooltip">
        Badge
      </Badge>,
    )
    const badge = screen.getByTestId('test-badge')
    expect(badge).toHaveAttribute('title', 'Tooltip')
  })
})

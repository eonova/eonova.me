import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from '~/components/base/skeleton'

describe('skeleton Component', () => {
  it('should render skeleton with default props', () => {
    render(<Skeleton data-testid="skeleton" />)

    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('should accept custom className', () => {
    render(<Skeleton className="custom-skeleton" data-testid="skeleton" />)

    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('custom-skeleton')
    expect(skeleton).toHaveClass('animate-pulse') // Should still have default classes
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Skeleton className="h-4 w-4" data-testid="skeleton" />)

    let skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-4', 'w-4')

    rerender(<Skeleton className="h-8 w-full" data-testid="skeleton" />)
    skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-8', 'w-full')

    rerender(<Skeleton className="h-12 w-12 rounded-full" data-testid="skeleton" />)
    skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-12', 'w-12', 'rounded-full')
  })

  it('should render multiple skeletons for list loading', () => {
    render(
      <div data-testid="skeleton-list">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-4 w-full" />
        ))}
      </div>,
    )

    const container = screen.getByTestId('skeleton-list')
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons).toHaveLength(3)
  })

  it('should render card skeleton layout', () => {
    render(
      <div className="space-y-3" data-testid="card-skeleton">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>,
    )

    const container = screen.getByTestId('card-skeleton')
    expect(container).toBeInTheDocument()

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons).toHaveLength(3)
  })

  it('should render avatar skeleton', () => {
    render(
      <div className="flex items-center space-x-4" data-testid="avatar-skeleton">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>,
    )

    const container = screen.getByTestId('avatar-skeleton')
    expect(container).toBeInTheDocument()

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons).toHaveLength(3)

    // Check if avatar skeleton has rounded-full class
    const avatarSkeleton = container.querySelector('.rounded-full')
    expect(avatarSkeleton).toBeInTheDocument()
  })

  it('should render table skeleton', () => {
    render(
      <div className="space-y-2" data-testid="table-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ))}
      </div>,
    )

    const container = screen.getByTestId('table-skeleton')
    expect(container).toBeInTheDocument()

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons).toHaveLength(15) // 5 rows × 3 columns
  })

  it('should support custom HTML attributes', () => {
    render(<Skeleton data-testid="custom-skeleton" aria-label="Loading content" role="status" />)

    const skeleton = screen.getByTestId('custom-skeleton')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
    expect(skeleton).toHaveAttribute('role', 'status')
  })

  it('should be accessible for screen readers', () => {
    render(
      <Skeleton
        className="h-4 w-full"
        aria-label="Loading article content"
        role="status"
        data-testid="accessible-skeleton"
      />,
    )

    const skeleton = screen.getByTestId('accessible-skeleton')
    expect(skeleton).toHaveAttribute('role', 'status')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading article content')
  })

  it('should render text skeleton with proper spacing', () => {
    render(
      <div className="space-y-2" data-testid="text-skeleton">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>,
    )

    const container = screen.getByTestId('text-skeleton')
    expect(container).toBeInTheDocument()

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons).toHaveLength(3)

    // Check different widths
    expect(skeletons[0]).toHaveClass('w-full')
    expect(skeletons[1]).toHaveClass('w-full')
    expect(skeletons[2]).toHaveClass('w-3/4')
  })
})

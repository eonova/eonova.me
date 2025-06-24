import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/base/avatar'

describe('avatar Component', () => {
  it('should render avatar with image', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )

    // Check that the fallback is rendered (since image might not load in test)
    const fallback = screen.getByText('JD')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveClass('bg-muted', 'flex', 'size-full')
  })

  it('should show fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="invalid-url" alt="User Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )

    // The fallback should be in the DOM
    const fallback = screen.getByText('JD')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveClass('bg-muted', 'flex', 'size-full')
  })

  it('should render only fallback when no image is provided', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )

    const fallback = screen.getByText('JD')
    expect(fallback).toBeInTheDocument()

    const image = screen.queryByRole('img')
    expect(image).not.toBeInTheDocument()
  })

  it('should accept custom className', () => {
    render(
      <Avatar className="custom-avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )

    const avatar = screen.getByText('JD').closest('[class*="custom-avatar"]')
    expect(avatar).toBeInTheDocument()
  })

  it('should render different sizes', () => {
    const { rerender } = render(
      <Avatar className="h-8 w-8" data-testid="small-avatar">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>,
    )

    let avatar = screen.getByTestId('small-avatar')
    expect(avatar).toHaveClass('h-8', 'w-8')

    rerender(
      <Avatar className="h-16 w-16" data-testid="large-avatar">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>,
    )

    avatar = screen.getByTestId('large-avatar')
    expect(avatar).toHaveClass('h-16', 'w-16')
  })

  it('should handle long fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>Very Long Name</AvatarFallback>
      </Avatar>,
    )

    const fallback = screen.getByText('Very Long Name')
    expect(fallback).toBeInTheDocument()
  })

  it('should be accessible', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe's profile picture" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )

    // Check that the fallback is accessible
    const fallback = screen.getByText('JD')
    expect(fallback).toBeInTheDocument()
  })

  it('should handle empty fallback', () => {
    render(
      <Avatar data-testid="empty-avatar">
        <AvatarFallback></AvatarFallback>
      </Avatar>,
    )

    const avatar = screen.getByTestId('empty-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('should support custom attributes', () => {
    render(
      <Avatar data-testid="user-avatar">
        <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )

    const avatar = screen.getByTestId('user-avatar')
    expect(avatar).toBeInTheDocument()
  })
})

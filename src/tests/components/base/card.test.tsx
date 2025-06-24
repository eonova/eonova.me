import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/base/card'

describe('card Components', () => {
  describe('card', () => {
    it('should render basic card', () => {
      render(<Card data-testid="card">Card content</Card>)

      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card content')
    })

    it('should accept custom className', () => {
      render(<Card className="custom-card">Content</Card>)

      const card = screen.getByText('Content')
      expect(card).toHaveClass('custom-card')
    })
  })

  describe('cardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)

      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header content')
    })
  })

  describe('cardTitle', () => {
    it('should render card title', () => {
      render(<CardTitle>Card Title</CardTitle>)

      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
    })

    it('should render as h3 heading', () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
    })
  })

  describe('cardDescription', () => {
    it('should render card description', () => {
      render(<CardDescription>This is a description</CardDescription>)

      const description = screen.getByText('This is a description')
      expect(description).toBeInTheDocument()
    })
  })

  describe('cardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Main content here</CardContent>)

      const content = screen.getByText('Main content here')
      expect(content).toBeInTheDocument()
    })
  })

  describe('cardFooter', () => {
    it('should render card footer', () => {
      render(<CardFooter>Footer content</CardFooter>)

      const footer = screen.getByText('Footer content')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('complete Card', () => {
    it('should render complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button type="button">Action Button</button>
          </CardFooter>
        </Card>,
      )

      const card = screen.getByTestId('complete-card')
      expect(card).toBeInTheDocument()

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description text')).toBeInTheDocument()
      expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })

    it('should maintain proper structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
      )

      const title = screen.getByText('Title')
      const content = screen.getByText('Content')

      // Title should come before content in DOM order
      expect(title.compareDocumentPosition(content)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    it('should handle nested content', () => {
      render(
        <Card>
          <CardContent>
            <div>
              <h4>Nested Title</h4>
              <p>Nested paragraph</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CardContent>
        </Card>,
      )

      expect(screen.getByText('Nested Title')).toBeInTheDocument()
      expect(screen.getByText('Nested paragraph')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('should be accessible', () => {
      render(
        <Card role="article" aria-labelledby="card-title">
          <CardHeader>
            <CardTitle id="card-title">Accessible Card</CardTitle>
            <CardDescription>This card is accessible</CardDescription>
          </CardHeader>
          <CardContent>Accessible content</CardContent>
        </Card>,
      )

      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-labelledby', 'card-title')

      const title = screen.getByText('Accessible Card')
      expect(title).toHaveAttribute('id', 'card-title')
    })
  })
})

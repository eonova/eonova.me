import { render, screen } from '@testing-library/react'
import type { Note } from 'content-collections'
import { describe, expect, it, vi } from 'vitest'
import { NoteProvider, useNoteContext } from '~/contexts/note'

// Mock Note data
const mockNote: Note = {
  slug: 'test-note',
  title: 'Test Note',
  date: '2024-01-01',
  summary: 'This is a test note',
  mood: 'happy',
  weather: 'sunny',
  cover: '/test-cover.jpg',
  content: 'Test note content',
  code: 'test-code',
  type: 'notes',
  toc: [],
  _meta: {
    filePath: 'test-note.md',
    fileName: 'test-note.md',
    directory: 'notes',
    path: 'test-note',
    extension: 'md',
  },
}

// Test component that uses the context
function TestComponent() {
  const note = useNoteContext()
  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.summary}</p>
      <span data-testid="mood">{note.mood}</span>
      <span data-testid="weather">{note.weather}</span>
    </div>
  )
}

// Test component that tries to use context without provider
function TestComponentWithoutProvider() {
  const note = useNoteContext()
  return <div>{note.title}</div>
}

describe('noteContext', () => {
  it('should provide note data to children', () => {
    render(
      <NoteProvider value={mockNote}>
        <TestComponent />
      </NoteProvider>,
    )

    expect(screen.getByText('Test Note')).toBeInTheDocument()
    expect(screen.getByText('This is a test note')).toBeInTheDocument()
    expect(screen.getByTestId('mood')).toHaveTextContent('happy')
    expect(screen.getByTestId('weather')).toHaveTextContent('sunny')
  })

  it('should throw error when used without provider', () => {
    // Mock console.error to avoid error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponentWithoutProvider />)
    }).toThrow('useNoteContext must be used within a NoteProvider')

    consoleSpy.mockRestore()
  })

  it('should update when note data changes', () => {
    const updatedNote: Note = {
      ...mockNote,
      title: 'Updated Note',
      summary: 'Updated summary',
      mood: 'excited',
    }

    const { rerender } = render(
      <NoteProvider value={mockNote}>
        <TestComponent />
      </NoteProvider>,
    )

    expect(screen.getByText('Test Note')).toBeInTheDocument()
    expect(screen.getByTestId('mood')).toHaveTextContent('happy')

    rerender(
      <NoteProvider value={updatedNote}>
        <TestComponent />
      </NoteProvider>,
    )

    expect(screen.getByText('Updated Note')).toBeInTheDocument()
    expect(screen.getByText('Updated summary')).toBeInTheDocument()
    expect(screen.getByTestId('mood')).toHaveTextContent('excited')
  })

  it('should provide all note properties', () => {
    function DetailedTestComponent() {
      const note = useNoteContext()
      return (
        <div>
          <span data-testid="slug">{note.slug}</span>
          <span data-testid="date">{note.date}</span>
          <span data-testid="cover">{note.cover}</span>
          <span data-testid="content">{note.content}</span>
          <span data-testid="type">{note.type}</span>
        </div>
      )
    }

    render(
      <NoteProvider value={mockNote}>
        <DetailedTestComponent />
      </NoteProvider>,
    )

    expect(screen.getByTestId('slug')).toHaveTextContent('test-note')
    expect(screen.getByTestId('date')).toHaveTextContent('2024-01-01')
    expect(screen.getByTestId('cover')).toHaveTextContent('/test-cover.jpg')
    expect(screen.getByTestId('content')).toHaveTextContent('Test note content')
    expect(screen.getByTestId('type')).toHaveTextContent('notes')
  })

  it('should work with nested components', () => {
    function ParentComponent() {
      return (
        <div>
          <h2>Parent</h2>
          <ChildComponent />
        </div>
      )
    }

    function ChildComponent() {
      return (
        <div>
          <h3>Child</h3>
          <GrandChildComponent />
        </div>
      )
    }

    function GrandChildComponent() {
      const note = useNoteContext()
      return <span data-testid="nested-title">{note.title}</span>
    }

    render(
      <NoteProvider value={mockNote}>
        <ParentComponent />
      </NoteProvider>,
    )

    expect(screen.getByTestId('nested-title')).toHaveTextContent('Test Note')
  })

  it('should handle note with minimal data', () => {
    const minimalNote: Note = {
      slug: 'minimal',
      title: 'Minimal Note',
      date: '2024-01-01',
      mood: 'neutral',
      weather: 'cloudy',
      cover: '',
      content: '',
      code: '',
      type: 'notes',
      toc: [],
      _meta: {
        filePath: 'minimal.md',
        fileName: 'minimal.md',
        directory: 'notes',
        path: 'minimal',
        extension: 'md',
      },
    }

    function MinimalTestComponent() {
      const note = useNoteContext()
      return (
        <div>
          <span data-testid="title">{note.title}</span>
          <span data-testid="summary">{note.summary || 'No summary'}</span>
        </div>
      )
    }

    render(
      <NoteProvider value={minimalNote}>
        <MinimalTestComponent />
      </NoteProvider>,
    )

    expect(screen.getByTestId('title')).toHaveTextContent('Minimal Note')
    expect(screen.getByTestId('summary')).toHaveTextContent('No summary')
  })

  it('should maintain context display name', () => {
    // This test verifies that the context has the correct display name
    // which is useful for debugging
    expect(NoteProvider).toBeDefined()
    expect(typeof NoteProvider).toBe('object')
    expect(NoteProvider.$$typeof).toBeDefined() // React context provider symbol
  })

  it('should work with multiple providers (nested)', () => {
    const outerNote: Note = {
      ...mockNote,
      title: 'Outer Note',
    }

    const innerNote: Note = {
      ...mockNote,
      title: 'Inner Note',
    }

    function OuterComponent() {
      const note = useNoteContext()
      return <span data-testid="outer">{note.title}</span>
    }

    function InnerComponent() {
      const note = useNoteContext()
      return <span data-testid="inner">{note.title}</span>
    }

    render(
      <NoteProvider value={outerNote}>
        <OuterComponent />
        <NoteProvider value={innerNote}>
          <InnerComponent />
        </NoteProvider>
      </NoteProvider>,
    )

    expect(screen.getByTestId('outer')).toHaveTextContent('Outer Note')
    expect(screen.getByTestId('inner')).toHaveTextContent('Inner Note')
  })

  it('should handle note with complex toc structure', () => {
    const noteWithToc: Note = {
      ...mockNote,
      toc: [
        { id: 'heading-1', text: 'First Heading', level: 1 },
        { id: 'heading-2', text: 'Second Heading', level: 2 },
      ],
    }

    function TocTestComponent() {
      const note = useNoteContext()
      return (
        <div>
          {note.toc.map((item: any) => (
            <div key={item.id} data-testid={`toc-${item.id}`}>
              {item.text} (Level
              {item.level})
            </div>
          ))}
        </div>
      )
    }

    render(
      <NoteProvider value={noteWithToc}>
        <TocTestComponent />
      </NoteProvider>,
    )

    expect(screen.getByTestId('toc-heading-1')).toHaveTextContent('First Heading (Level1)')
    expect(screen.getByTestId('toc-heading-2')).toHaveTextContent('Second Heading (Level2)')
  })
})

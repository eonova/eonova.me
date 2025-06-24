import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '~/components/base/input'

describe('input Component', () => {
  it('should render with default props', () => {
    render(<Input />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'h-9', 'w-full')
  })

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter text here" />)

    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toBeInTheDocument()
  })

  it('should handle value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello World')

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('Hello World')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should render different input types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    const passwordInput = screen.getByDisplayValue('')
    expect(passwordInput).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('should forward refs', () => {
    let refCurrent: HTMLInputElement | null = null

    const TestComponent = () => {
      const ref = useRef<HTMLInputElement>(null)
      refCurrent = ref.current
      return <Input ref={ref} />
    }

    render(<TestComponent />)
    expect(refCurrent).toBeInstanceOf(HTMLInputElement)
  })

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)

    const input = screen.getByRole('textbox')

    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should render with default value', () => {
    render(<Input defaultValue="Default text" />)

    const input = screen.getByDisplayValue('Default text')
    expect(input).toBeInTheDocument()
  })

  it('should render as controlled component', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    const { rerender } = render(<Input value="controlled" onChange={handleChange} />)

    const input = screen.getByDisplayValue('controlled')
    expect(input).toHaveValue('controlled')

    await user.type(input, 'test')
    expect(handleChange).toHaveBeenCalled()

    // Update the value prop
    rerender(<Input value="updated" onChange={handleChange} />)
    expect(input).toHaveValue('updated')
  })

  it('should handle keyboard events', async () => {
    const user = userEvent.setup()
    const handleKeyDown = vi.fn()

    render(<Input onKeyDown={handleKeyDown} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(handleKeyDown).toHaveBeenCalled()
  })

  it('should render with required attribute', () => {
    render(<Input required />)

    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('should render with readonly attribute', () => {
    render(<Input readOnly value="readonly text" />)

    const input = screen.getByDisplayValue('readonly text')
    expect(input).toHaveAttribute('readonly')
  })

  it('should handle maxLength attribute', async () => {
    const user = userEvent.setup()
    render(<Input maxLength={5} />)

    const input = screen.getByRole('textbox')
    await user.type(input, '123456789')

    expect(input).toHaveValue('12345')
  })
})

import { describe, expect, it } from 'vitest'
import { extractPlainTextFromMarkdown } from '~/utils/removeuseless'

describe('removeuseless', () => {
  it('should remove useless', () => {
    const content = `## test demo ### test2 ** font **`
    const res = extractPlainTextFromMarkdown(content).replace(/\n/g, '')
    expect(res).toBe(`test demo test2  font`)
  })

  it('should remove links', () => {
    const content = `[test](https://eonova.me)`
    const res = extractPlainTextFromMarkdown(content).replace(/\n/g, '')
    expect(res).toBe('test')
  })

  it('should remove code blocks', () => {
    const content = '```test```'
    const res = extractPlainTextFromMarkdown(content).replace(/\n/g, '')
    expect(res).toBe('')
  })
})

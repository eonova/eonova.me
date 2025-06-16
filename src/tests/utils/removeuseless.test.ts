import { describe, expect, it } from 'vitest'
import { extractPlainTextFromMarkdown } from '~/utils/removeuseless'

describe('removeuseless', () => {
  it('should remove useless', () => {
    const content = `## test demo ### test2 ** font **`
    const res = extractPlainTextFromMarkdown(content).replace(/\n/g, '')
    expect(res).toBe(`test demo test2  font`)
  })
})

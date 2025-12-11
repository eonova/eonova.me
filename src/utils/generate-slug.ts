import { createHash } from 'node:crypto'

export function generateSlug(str: string, length: number): string {
  const trimmed = str.trim()
  if (!trimmed)
    return ''

  const chinesePattern = /[\u4E00-\u9FA5\u3400-\u4DBF\uF900-\uFAFF]/

  if (chinesePattern.test(trimmed)) {
    const hash = createHash('sha256').update(str.normalize('NFKC')).digest('hex')

    return hash.slice(0, Math.min(length, 64))
  }
  return str
}

/**
 * 从Markdown中提取纯文本的函数
 *
 * @param markdown - 输入的Markdown字符串
 * @returns 提取后的纯文本字符串
 */
export function extractPlainTextFromMarkdown(plainText: string): string {
  plainText = plainText
    .replace(/#{1,6}\s+/g, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*>\s+/gm, '')

  return plainText.trim()
}

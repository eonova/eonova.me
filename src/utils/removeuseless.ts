/**
 * 从Markdown中提取纯文本的函数
 *
 * @param markdown - 输入的Markdown字符串
 * @returns 提取后的纯文本字符串
 */
export function extractPlainTextFromMarkdown(markdown: string): string {
  return markdown
    // 移除标题标记
    .replace(/#{1,6}\s+/g, '')
    // 拆分处理加粗：**text** 和 __text__
    .replace(/\*\*([\s\S]+?)\*\*/g, '$1')
    .replace(/__([\s\S]+?)__/g, '$1')
    // 拆分处理斜体：*text* 和 _text_
    .replace(/\*([\s\S]+?)\*/g, '$1')
    .replace(/_([\s\S]+?)_/g, '$1')
    // 移除无序列表标记
    .replace(/^\s*[-*+]\s+/gm, '')
    // 移除有序列表标记
    .replace(/^\s*\d+\.\s+/gm, '')
    // 处理链接 [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`([^`]+)`/g, '$1')
    // 移除引用标记
    .replace(/^\s*>\s+/gm, '')
    .trim()
}

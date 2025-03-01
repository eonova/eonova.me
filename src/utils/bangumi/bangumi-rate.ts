export function getBangumiRate(score: number): string {
  const starCount = Math.round(score / 2) // 将10分制转换为5星制
  return '★'.repeat(starCount) + '☆'.repeat(5 - starCount)
}

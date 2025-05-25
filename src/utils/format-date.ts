export function formatDate(date: string | number | Date) {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (diffDays < 1) {
    return '今天'
  }
  if (diffDays < 30) {
    return `${diffDays} 天前`
  }
  else {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date(date)).replace('星期', ' 星期')
  }
}

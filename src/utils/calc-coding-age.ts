export function calculateCodingYears(year = 2022, month = 3, day = 1) {
  // 获取开始日期
  const startDate = new Date(year, month, day) // 注意：月份是从 0 开始计数的，所以 4 月对应的是 3

  // 获取当前日期
  const currentDate = new Date()

  // 计算总月数差
  let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12
  months += currentDate.getMonth() - startDate.getMonth()

  // 如果当前日期的日小于开始日期的日，月份减 1
  if (currentDate.getDate() < startDate.getDate()) {
    months--
  }

  // 计算年和剩余月数
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) {
    return `${remainingMonths} 个月`
  }
  else if (remainingMonths === 0) {
    return `${years} 年`
  }
  else {
    return `${years} 年 ${remainingMonths} 个月`
  }
}

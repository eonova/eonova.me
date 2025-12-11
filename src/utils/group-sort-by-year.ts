export function groupAndSortByYear<T extends { dateCreated: string | Date | null }>(data: T[]) {
  const temp = data.reduce((acc: { [key: string]: T[] }, current) => {
    if (!current.dateCreated)
      return acc
    const date = new Date(current.dateCreated)
    const year = date.getUTCFullYear().toString()

    // 如果年份不在当前的分组中，初始化一个空数组
    acc[year] ??= []

    // 将当前对象添加到对应年份的数组中
    acc[year].push(current)

    return acc
  }, {})
  for (const year in temp) {
    if (Object.prototype.hasOwnProperty.call(temp, year)) {
      temp[year]?.sort((a, b) => {
        if (!a.dateCreated || !b.dateCreated)
          return 0
        // 提取日期并排序
        const dateA = new Date(a.dateCreated)
        const dateB = new Date(b.dateCreated)

        // 从大到小排序（降序）
        return dateB.getTime() - dateA.getTime()
      })
    }
  }
  return temp
}

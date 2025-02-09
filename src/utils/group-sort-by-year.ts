import type { Project } from 'content-collections'

export function groupAndSortByYear(data: Project[]) {
  const temp = data.reduce((acc: { [key: string]: Project[] }, current) => {
    const date = new Date(current.date);
    const year = date.getUTCFullYear().toString();

    // 如果年份不在当前的分组中，初始化一个空数组
    if (!acc[year]) {
      acc[year] = [];
    }

    // 将当前对象添加到对应年份的数组中
    acc[year].push(current);

    return acc;
  }, {});
  for (const year in temp) {
    if (temp.hasOwnProperty(year)) {
      temp[year]?.sort((a, b) => {
        // 提取日期并排序
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // 从大到小排序（降序）
        return dateB.getTime() - dateA.getTime();
      });
    }
  }
  return temp
}

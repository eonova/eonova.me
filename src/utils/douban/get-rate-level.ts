import type { RateLevel } from '~/types/douban'

export function getRateLevel(rate: number): RateLevel {
  const mapping: Record<number, RateLevel> = {
    1: '粪作',
    2: '一般',
    3: '一般',
    4: '佳作',
    5: '封神',
  }
  return mapping[rate] || '较好'
}

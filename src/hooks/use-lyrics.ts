/* eslint-disable regexp/no-super-linear-backtracking */
import { useCallback, useEffect, useState } from 'react'

interface LyricLine {
  time: number // 时间戳（秒）
  text: string // 歌词文本
  index: number // 行索引
  isActive?: boolean // 是否激活
}

export function useLyrics(lrcUrl: string) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1)

  const syncLyrics = useCallback((currentTime: number) => {
    if (lyrics.length === 0)
      return -1

    let low = 0
    let high = lyrics.length - 1
    let resultIndex = -1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (lyrics[mid]!.time <= currentTime) {
        resultIndex = mid
        low = mid + 1
      }
      else {
        high = mid - 1
      }
    }

    return resultIndex
  }, [lyrics])

  const parseLRC = useCallback((lrcText: string): LyricLine[] => {
    if (!lrcText)
      return []

    const lines = lrcText.split('\n')
    const lyrics: LyricLine[] = []
    const regex = /\[(\d+):(\d+)\.?(\d*)\](.*)/

    lines.forEach((line, index) => {
      const match = line.match(regex)
      if (match) {
        const min = Number.parseInt(match[1]!)
        const sec = Number.parseInt(match[2]!)
        const ms = match[3] ? Number.parseInt(match[3]) / 10 ** match[3].length : 0
        const time = min * 60 + sec + ms
        const text = match[4]?.trim()

        if (text) {
          lyrics.push({ time, text, index })
        }
      }
    })

    lyrics.sort((a, b) => a.time - b.time)

    if (lyrics.length === 0) {
      lyrics.push({ time: 0, text: '暂无歌词', index: 0 })
    }

    return lyrics
  }, [])

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        if (lrcUrl) {
          const response = await fetch(lrcUrl)
          const lrcText = await response.text()
          const parsedLyrics = parseLRC(lrcText)
          setLyrics(parsedLyrics)
          setCurrentLyricIndex(-1)
        }
      }
      catch (error) {
        console.error('歌词获取失败:', error)
        setLyrics([])
        setCurrentLyricIndex(-1)
      }
    }
    fetchLyrics()
  }, [lrcUrl])

  return { lyrics, currentLyricIndex, syncLyrics, setCurrentLyricIndex }
}

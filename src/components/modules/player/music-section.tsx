'use client'

import type { Track } from '~/types/music'
import { useCallback, useEffect, useState } from 'react'
import { useLyrics } from '~/hooks/use-lyrics'
import { cn } from '~/utils/cn'

interface MusicSectionProps {
  isPlaying: boolean
  currentTrack?: Track
  togglePlay: () => void
  lyricsContainerRef: React.RefObject<HTMLDivElement | null>
  currentTime: number
}

const MusicSection: React.FC<MusicSectionProps> = ({
  currentTrack,
  togglePlay,
  isPlaying,
  lyricsContainerRef,
  currentTime,
}) => {
  // 使用自定义Hook
  const { lyrics, currentLyricIndex, syncLyrics, setCurrentLyricIndex }
    = useLyrics(currentTrack?.lrc ?? '')

  const [lyricsOffset, setLyricsOffset] = useState(0)
  const getLyricLineCount = useCallback((lyricElement: HTMLElement): number => {
    if (!lyricElement)
      return 1

    const style = window.getComputedStyle(lyricElement)
    const lineHeight = Number.parseFloat(style.lineHeight)
    const paddingTop = Number.parseFloat(style.paddingTop)
    const paddingBottom = Number.parseFloat(style.paddingBottom)

    // 计算纯内容高度（减去内边距）
    const contentHeight = lyricElement.scrollHeight - paddingTop - paddingBottom

    // 计算行数 = 内容高度 / 行高
    const lineCount = Math.round(contentHeight / lineHeight)

    return Math.max(1, lineCount) // 至少1行
  }, [])
  // 滚动到当前歌词行 - 使用useCallback避免不必要的重新创建
  const scrollToCurrentLyric = useCallback((index: number) => {
    if (!lyricsContainerRef.current || index < 0 || lyrics.length === 0)
      return

    const container = lyricsContainerRef.current
    const activeElement = container.querySelector(`[data-lyric-index="${index}"]`) as HTMLElement

    if (!activeElement)
      return

    const containerHeight = container.clientHeight
    const elementHeight = activeElement.offsetHeight
    const elementTop = activeElement.offsetTop

    // 获取当前歌词行的实际行数
    const lineCount = getLyricLineCount(activeElement)
    const lineHeight = Number.parseFloat(window.getComputedStyle(activeElement).lineHeight)

    // 计算歌词行总高度（行数 × 行高）
    const lyricTotalHeight = lineCount * lineHeight

    // 容器中间线位置
    const middleLine = containerHeight / 2

    let targetOffset

    // 关键改进：考虑换行后的智能滚动逻辑
    if (lineCount === 1) {
      // 单行歌词：使用原有逻辑
      if (elementTop + elementHeight <= middleLine) {
        targetOffset = 0
      }
      else {
        targetOffset = middleLine - elementTop - elementHeight / 2 + (lineHeight / 2) * (lineCount % 2)
      }
    }
    else {
      // 多行歌词：确保整个歌词块在视图中可见
      const lyricBottom = elementTop + lyricTotalHeight

      if (lyricBottom <= middleLine) {
        // 多行歌词整体还在上半部分，不滚动
        targetOffset = 0
      }
      else if (elementTop >= middleLine) {
        // 多行歌词已经开始进入下半部分，开始居中
        targetOffset = middleLine - elementTop - lyricTotalHeight / 2 - (lineHeight / 2) * (lineCount % 2)
      }
      else {
        // 多行歌词跨越中间线，适度滚动显示完整内容
        targetOffset = middleLine - lyricBottom + lyricTotalHeight / 2 - (lineHeight / 2) * (lineCount % 2)
      }
    }

    // 边界限制
    const contentDiv = container.firstElementChild as HTMLElement
    const contentHeight = contentDiv.scrollHeight
    const maxOffset = Math.max(0, contentHeight - containerHeight)
    const constrainedOffset = Math.max(-maxOffset, Math.min(0, targetOffset))

    requestAnimationFrame(() => {
      setLyricsOffset(constrainedOffset)
    })
  }, [lyrics.length, getLyricLineCount])

  // 歌词同步 - 确保不会跳转
  useEffect(() => {
    const newIndex = syncLyrics(currentTime)
    if (newIndex !== currentLyricIndex) {
      setCurrentLyricIndex(newIndex)
      // 使用setTimeout确保DOM更新后再执行滚动
      setTimeout(() => {
        scrollToCurrentLyric(newIndex)
      }, 50)
    }
  }, [currentTime, syncLyrics, currentLyricIndex, scrollToCurrentLyric])
  return (
    <div className="flex items-center p-6 pb-0 space-x-4 mb-2">
      <div
        className={cn('relative w-40 h-40 flex justify-center items-center animate-spin-custom', isPlaying && 'playing')}
        // style={{ transform: `rotate(${currentAngle}deg)` }}

        // ref={musicSectionRef}
        onClick={togglePlay}
        id="music-img"
      >
        <img
          src={currentTrack?.pic}
          alt={currentTrack?.name}
          className="w-[7em] h-[7em] rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMzNzM3MzciLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPgo8cGF0aCBkPSJtOSAxMiAyIDIgNC00Ii8+CjxwYXRoIGQ9Ik0yMSAxNVY5YTkgOSAwIDEgMC05IDlsNi02Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
          }}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="dark:text-white text-black font-medium text-xl truncate">{currentTrack?.name}</h3>
        <p className="text-gray-400 text-sm truncate">{currentTrack?.artist}</p>
        {/* 歌词显示区域 */}
        <div className="relative h-16 px-1 overflow-hidden mt-1">
          <div
            ref={lyricsContainerRef}
            className="h-full overflow-y-hidden scrollbar-track-transparent scrollbar-thumb-gray-400/20 lyrics-container"
          >
            <div
              className="transition-transform duration-500 ease-out"
              style={{ transform: `translateY(${lyricsOffset}px)` }}
            >
              {lyrics.map((line, index) => (
                <div
                  key={index}
                  data-lyric-index={index}
                  className={cn(
                    'rounded-lg text-xs px-1 transition-all duration-300 text-center',
                    index === currentLyricIndex
                      ? 'text-red-400 font-semibold lyric-line-active'
                      : 'text-gray-400 opacity-40',
                  )}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicSection

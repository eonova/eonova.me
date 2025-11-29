import type { Track } from '~/types/music'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type PlayMode = 'order' | 'random' | 'loop'

export function usePlaybackControl(currentPlaylist: Track[], audioRef: React.RefObject<HTMLAudioElement | null>) {
  // 简化状态管理
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playMode, setPlayMode] = useState<PlayMode>('order')
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playedHistory, setPlayedHistory] = useState<number[]>([])
  const [isMuted, setIsMuted] = useState(false) // 添加静音状态变量[3,4](@ref)

  // 使用ref跟踪最新状态，避免闭包问题
  const stateRef = useRef({ isPlaying, currentTrackIndex, repeatMode: playMode, currentTime, playedHistory, isMuted })

  // 同步ref与state
  useEffect(() => {
    stateRef.current = { isPlaying, currentTrackIndex, repeatMode: playMode, currentTime, playedHistory, isMuted }
  }, [isPlaying, currentTrackIndex, playMode, currentTime, playedHistory, isMuted])

  // 当前曲目计算
  const currentTrack = useMemo(() =>
    currentPlaylist[currentTrackIndex] || null, [currentPlaylist, currentTrackIndex])

  // 进度跳转函数
  const seekTo = useCallback((time: number) => {
    if (audioRef.current && duration > 0) {
      const clampedTime = Math.max(0, Math.min(duration, time))
      audioRef.current.currentTime = clampedTime
      setCurrentTime(clampedTime)
    }
  }, [audioRef, duration])

  // 简化版随机索引生成
  const getRandomTrackIndex = useCallback((excludeCurrent: boolean = false): number => {
    const { currentTrackIndex, playedHistory } = stateRef.current

    if (currentPlaylist.length <= 1)
      return 0

    const availableIndices = currentPlaylist
      .map((_, index) => index)
      .filter(index => !excludeCurrent || index !== currentTrackIndex)
      .filter(index => !playedHistory.includes(index))

    if (availableIndices.length === 0) {
      setPlayedHistory([])
      return currentTrackIndex
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]

    // 记录播放历史
    if (!playedHistory.includes(randomIndex as number)) {
      setPlayedHistory(prev => [...prev, randomIndex] as number[])
    }

    return randomIndex ?? 0
  }, [currentPlaylist.length])

  // 统一曲目切换逻辑
  const switchTrack = useCallback((direction: 'next' | 'prev') => {
    const { currentTrackIndex, repeatMode, isPlaying } = stateRef.current
    let newIndex = currentTrackIndex

    switch (repeatMode) {
      case 'loop':
        // 循环模式：播放到最后一首后回到第一首
        newIndex = direction === 'next'
          ? (currentTrackIndex < currentPlaylist.length - 1 ? currentTrackIndex + 1 : 0)
          : (currentTrackIndex > 0 ? currentTrackIndex - 1 : currentPlaylist.length - 1)
        break

      case 'random':
        // 随机播放
        newIndex = direction === 'next'
          ? getRandomTrackIndex(true)
          : (playedHistory.length > 1
              ? playedHistory[playedHistory.length - 2]
              : (currentTrackIndex > 0 ? currentTrackIndex - 1 : currentPlaylist.length - 1)) as number
        if (direction === 'prev' && playedHistory.length > 1) {
          setPlayedHistory(prev => prev.slice(0, -1))
        }
        break

      case 'order':
      default:
        // 顺序模式：播放完即停止
        newIndex = direction === 'next'
          ? Math.min(currentTrackIndex + 1, currentPlaylist.length - 1)
          : Math.max(currentTrackIndex - 1, 0)
        break
    }

    setCurrentTrackIndex(newIndex)
    setCurrentTime(0)

    // 如果正在播放，继续播放新曲目
    if (!isPlaying && newIndex !== currentTrackIndex) {
      setTimeout(() => setIsPlaying(true), 100)
    }
  }, [currentPlaylist.length, getRandomTrackIndex])

  // 下一曲和上一曲基于统一逻辑
  const nextTrack = useCallback(() => switchTrack('next'), [switchTrack])
  const previousTrack = useCallback(() => switchTrack('prev'), [switchTrack])

  // 选择特定曲目（支持进度调整）
  const selectTrack = useCallback((index: number, event?: React.MouseEvent) => {
    if (index < 0 || index >= currentPlaylist.length)
      return

    const { currentTrackIndex, repeatMode } = stateRef.current

    if (currentTrackIndex === index) {
      // 相同曲目：处理进度调整或切换播放状态
      if (event && duration > 0) {
        // 计算点击位置对应的播放时间
        const listItem = event.currentTarget as HTMLElement
        const rect = listItem.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const progressPercentage = clickX / rect.width
        seekTo(progressPercentage * duration)
        if (!isPlaying) {
          setIsPlaying(true)
        }
      }
      else {
        // 无点击事件：切换播放状态
        setIsPlaying(!isPlaying)
      }
    }
    else {
      // 不同曲目：切换到新曲目
      setCurrentTrackIndex(index)
      setCurrentTime(0)

      // 随机模式下记录播放历史
      if (repeatMode === 'random' && !playedHistory.includes(index)) {
        setPlayedHistory(prev => [...prev, index])
      }

      // 自动开始播放
      setIsPlaying(true)
    }
  }, [currentPlaylist.length, duration, seekTo, isPlaying, playedHistory])

  // 切换播放模式
  const switchPlayMode = useCallback(() => {
    const modes: PlayMode[] = ['order', 'random', 'loop']
    const currentIndex = modes.indexOf(playMode)
    const newMode = modes[(currentIndex + 1) % modes.length]

    setPlayMode(newMode as PlayMode)

    // 随机模式初始化历史
    if (newMode === 'random') {
      setPlayedHistory([currentTrackIndex])
    }
    else {
      setPlayedHistory([])
    }

    return newMode
  }, [playMode, currentTrackIndex])

  // 音量控制
  const setVolumeLevel = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
    setVolume(clampedVolume)
  }, [audioRef])

  // 静音控制函数[3,4](@ref)
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted
    if (audioRef.current) {
      audioRef.current.muted = newMutedState
    }
    setIsMuted(newMutedState)
  }, [isMuted, audioRef])

  // 设置静音状态
  const setMute = useCallback((muted: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
    setIsMuted(muted)
  }, [audioRef])

  // 音频加载和时长获取
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.url)
      return

    const handleLoadedMetadata = () => {
      if (!Number.isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.src = currentTrack.url
    audio.load()

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentTrack?.url])

  // 核心音频事件处理
  useEffect(() => {
    const audio = audioRef.current
    if (!audio)
      return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      const { repeatMode } = stateRef.current

      switch (repeatMode) {
        case 'loop':
          // 循环模式：播放完当前后继续下一首
          nextTrack()
          break
        case 'random':
          // 随机模式：播放随机曲目
          nextTrack()
          break
        case 'order':
        default:
          // 顺序模式：播放到最后一首后停止
          if (currentTrackIndex < currentPlaylist.length - 1) {
            nextTrack()
          }
          else {
            setIsPlaying(false)
          }
          break
      }
    }

    // 设置音量和静音状态[4](@ref)
    audio.volume = volume
    audio.muted = isMuted

    // 添加事件监听
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    // 清理函数
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioRef, volume, isMuted, nextTrack, currentTrackIndex, currentPlaylist.length])

  // 播放状态控制
  useEffect(() => {
    if (!audioRef.current)
      return
    if (isPlaying) {
      audioRef.current.play()
    }
    else {
      audioRef.current.pause()
    }
  }, [currentTrack, isPlaying])

  return {
    // 状态变量
    currentTrackIndex,
    isPlaying,
    currentTime,
    playMode,
    volume,
    duration,
    currentTrack,
    playedHistory,
    isMuted, // 导出静音状态

    // 设置函数
    setCurrentTrackIndex,
    setIsPlaying,
    setCurrentTime,
    setVolume: setVolumeLevel,
    setIsMuted: setMute, // 导出设置静音函数

    // 控制方法
    nextTrack,
    previousTrack,
    selectTrack,
    switchPlayMode,
    seekTo,
    toggleMute, // 导出切换静音函数

    // 工具方法
    getRandomTrackIndex,
  }
}

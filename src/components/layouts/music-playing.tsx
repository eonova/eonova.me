'use client'

import { Pause, Play, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '~/components/base/button'

interface Track {
  name: string
  artist: string
  url: string
  pic: string
  lrc: string
}

interface Playlist {
  title: string
  list: Track[]
}

interface MusicPlayingProps {
  className?: string
  isVisible: boolean
  songs?: Playlist[]
}

const MusicPlaying: React.FC<MusicPlayingProps> = ({
  isVisible,
  songs,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume] = useState(0.7)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentPlaylist = songs?.[currentPlaylistIndex]?.list || []
  const currentTrack = currentPlaylist?.[currentTrackIndex]

  // 播放/暂停
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      }
      else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 上一首
  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
    else {
      setCurrentTrackIndex(currentPlaylist.length - 1)
    }
    setCurrentTime(0)
  }

  // 下一首
  const nextTrack = useCallback(() => {
    if (currentTrackIndex < currentPlaylist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    }
    else {
      setCurrentTrackIndex(0)
    }
    setCurrentTime(0)
  }, [currentTrackIndex, currentPlaylist.length])

  // 选择歌曲
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    audioRef.current?.play()
    setCurrentTime(0)
  }

  // 音频事件处理
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack)
      return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      }
      else if (repeatMode === 'all') {
        nextTrack()
      }
      else {
        setIsPlaying(false)
      }
    }

    const handleLoadedMetadata = () => {
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.volume = volume

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentTrack, repeatMode, volume, nextTrack])

  return (
    <motion.div
      initial={{ x: '140%', opacity: 0 }}
      animate={{
        x: isVisible ? '0%' : '140%',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed right-17 bottom-5 z-50 w-[400px] bg-background/20 backdrop-blur-[10px] rounded-2xl shadow-2xl border border-gray-700/50 border-solid overflow-hidden player-info"
    >
      {/* 专辑封面和歌曲信息 */}
      <div className="flex items-center p-6 pb-0 space-x-4 mb-4">
        <div className="relative">
          <img
            src={currentTrack?.pic}
            alt={currentTrack?.name}
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMzNzM3MzciLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPgo8cGF0aCBkPSJtOSAxMiAyIDIgNC00Ii8+CjxwYXRoIGQ9Ik0yMSAxNVY5YTkgOSAwIDEgMC05IDlsNi02Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
            }}
          />
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{currentTrack?.name}</h3>
          <p className="text-gray-400 text-sm truncate">{currentTrack?.artist}</p>
          <p className="text-gray-500 text-xs truncate">
            作曲：
            {currentTrack?.artist}
          </p>
          <p className="text-gray-500 text-xs">纯音乐，请欣赏</p>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center space-x-4 mb-4 controller">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsShuffled(!isShuffled)}
          className={`h-8 w-8 p-0 ${isShuffled ? 'text-red-400' : 'text-gray-400'} hover:text-white`}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={previousTrack}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 p-0"
        >
          {isPlaying
            ? (
                <Pause className="h-5 w-5 text-white" />
              )
            : (
                <Play className="h-5 w-5 text-white ml-0.5" />
              )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextTrack}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
        {/* 音量控制 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
            const currentIndex = modes.indexOf(repeatMode)
            const nextIndex = (currentIndex + 1) % modes.length
            setRepeatMode(modes[nextIndex]!)
          }}
          className={`h-8 w-8 p-0 ${repeatMode !== 'none' ? 'text-red-400' : 'text-gray-400'} hover:text-white`}
        >
          <Volume2 className="h-4 w-4 text-gray-400" />
        </Button>
      </div>

      {/* 播放列表 */}
      <div className="max-h-64 overflow-y-auto playlist">
        {/* 播放列表标签 */}
        <div className="border-t border-gray-700/50 border-solid">
          <div className="flex">
            {songs?.map((playlist, index) => (
              <button
                type="button"
                key={playlist.title}
                onClick={() => {
                  setCurrentPlaylistIndex(index)
                  setCurrentTrackIndex(0)
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium ${currentPlaylistIndex === index
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                {playlist.title}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/20 hover:scrollbar-thumb-gray-400/40">
          {currentPlaylist.map((track, index) => (
            <div
              key={track.url}
              onClick={() => selectTrack(index)}
              className={`flex items-center space-x-3 p-3 hover:bg-white/5 cursor-pointer transition-colors ${index === currentTrackIndex ? 'bg-white/10' : ''
              }`}
            >
              <span className="text-gray-400 text-sm w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${index === currentTrackIndex ? 'text-red-400' : 'text-white'
                }`}
                >
                  {track.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
              </div>
              {index === currentTrackIndex && isPlaying && (
                <>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 truncate">{currentTime}</p>
                  </div>
                  <motion.div
                    className="w-1 h-1 bg-red-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        preload="metadata"
      />
    </motion.div>
  )
}

export default MusicPlaying

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePlaybackControl } from '~/hooks/use-playback-control'
import MusicSection from '../modules/player/music-section'
import MusicPlayerContainer from '../modules/player/player-container'
import PlayerControl from '../modules/player/player-control'
import Playlist from '../modules/player/playlist'
import PlaylistTile from '../modules/player/playlist-title'
import '~/styles/page/music-playing.css'

interface Track {
  title: string
  author: string
  url: string
  pic: string
  lrc: string // LRC格式的歌词字符串
}

interface Playlist {
  title: string
  list: Track[]
}

interface MusicPlayerProps {
  className?: string
  isVisible: boolean
  songs?: Playlist[]
  onClose: () => void
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isVisible,
  songs,
  onClose,
}) => {
  // 状态管理
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0)

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const playlistScrollContainerRef = useRef<HTMLOListElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  // 计算值
  const currentPlaylist = useMemo(() =>
    songs?.[currentPlaylistIndex]?.list || [], [songs, currentPlaylistIndex])

  const {
    currentTrackIndex,
    isPlaying,
    currentTime,
    playMode,
    duration,
    currentTrack,
    isMuted,
    setCurrentTrackIndex,
    nextTrack,
    previousTrack,
    selectTrack,
    setIsPlaying,
    switchPlayMode,
    setIsMuted,
  } = usePlaybackControl(currentPlaylist, audioRef)

  // 当播放列表切换时，将滚动条置顶
  useEffect(() => {
    if (playlistScrollContainerRef.current) {
      playlistScrollContainerRef.current.scrollTop = 0
    }
  }, [currentPlaylistIndex])

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <MusicPlayerContainer isVisible={isVisible} isPlaying={isPlaying} onClose={onClose}>

      {/* 专辑封面和歌曲信息 */}
      <MusicSection
        isPlaying={isPlaying}
        currentTrack={currentTrack!}
        togglePlay={togglePlay}
        lyricsContainerRef={lyricsContainerRef}
        currentTime={currentTime}
      />

      {/* 控制按钮 */}
      <PlayerControl
        isPlaying={isPlaying}
        previousTrack={previousTrack}
        togglePlay={togglePlay}
        nextTrack={nextTrack}
        playMode={playMode}
        switchPlayMode={switchPlayMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* 歌单标题 */}
      <PlaylistTile
        songs={songs ?? []}
        setCurrentPlaylistIndex={setCurrentPlaylistIndex}
        setCurrentTrackIndex={setCurrentTrackIndex}
        currentPlaylistIndex={currentPlaylistIndex}
      />

      {/* 播放列表 */}
      <Playlist
        playlistScrollContainerRef={playlistScrollContainerRef}
        duration={duration}
        currentPlaylist={currentPlaylist}
        selectTrack={selectTrack}
        currentTrackIndex={currentTrackIndex}
        currentTime={currentTime}
      />

      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        preload="metadata"
      />

    </MusicPlayerContainer>
  )
}

export default MusicPlayer

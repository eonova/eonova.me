import { cn } from '~/utils/cn'

interface Track {
  title: string
  author: string
  url: string
  pic: string
  lrc: string // LRC格式的歌词字符串
}

interface PlaylistProps {
  playlistScrollContainerRef: React.RefObject<HTMLOListElement | null>
  duration: number
  currentPlaylist: Track[]
  selectTrack: (index: number, event?: React.MouseEvent<HTMLLIElement>) => void
  currentTrackIndex: number
  currentTime: number
}

const Playlist: React.FC<PlaylistProps> = ({
  playlistScrollContainerRef,
  duration,
  currentPlaylist,
  selectTrack,
  currentTrackIndex,
  currentTime,
}) => {
  // 时间格式化函数
  function formatSecondsToMMSS(seconds: number) {
    const totalSeconds = Math.floor(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }
  return (
    <ol
      ref={playlistScrollContainerRef}
      className="max-h-64 overflow-y-scroll playlist"
      onWheel={(e) => {
        e.stopPropagation()
        // 确保只在有内容可滚动时阻止冒泡
        const element = e.currentTarget
        const isScrollable = element.scrollHeight > element.clientHeight

        if (isScrollable) {
          const isAtTop = element.scrollTop === 0
          const isAtBottom = element.scrollTop + element.clientHeight === element.scrollHeight

          // 只有在不是边界情况时才完全阻止冒泡
          if (!(isAtTop && e.deltaY < 0) && !(isAtBottom && e.deltaY > 0)) {
            e.stopPropagation()
          }
        }
      }}
    >
      {currentPlaylist.map((track, index) => (
        <li
          key={track.url}
          onClick={event => selectTrack(index, event)}
          className={
            cn('relative flex items-center space-x-3 p-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors', index === currentTrackIndex ? 'bg-white/10' : '',
            )
          }
        >
          {
            currentTrackIndex === index && <div className="bg-gray-300/10 top-0 bottom-0 left-0 absolute z-1 transition-all duration-300" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}></div>
          }
          <p className="text-gray-400 text-sm pl-1 w-5 flex justify-end">{index + 1}</p>
          <div className="flex-1 min-w-0">
            <p className={`text-sm truncate ${index === currentTrackIndex ? 'text-red-400' : 'dark:text-white text-black'
            }`}
            >
              {track.title}
            </p>
          </div>
          <div className="text-right">
            {
              index !== currentTrackIndex && <p className="text-xs text-gray-400 truncate">{track.author}</p>
            }
          </div>
          {index === currentTrackIndex && (
            <>
              <div className="text-right">
                <p className="text-xs text-gray-400 truncate">
                  {formatSecondsToMMSS(Number(currentTime.toFixed(2)))}
                  {' '}
                  -
                  {' '}
                  {formatSecondsToMMSS(duration)}
                </p>
              </div>
            </>
          )}
        </li>
      ))}
    </ol>
  )
}

export default Playlist

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

interface PlaylistTileProps {
  songs: Playlist[]
  setCurrentPlaylistIndex: (v: number) => void
  setCurrentTrackIndex: (v: number) => void
  currentPlaylistIndex: number
}

const PlaylistTile: React.FC<PlaylistTileProps> = ({
  songs,
  setCurrentPlaylistIndex,
  setCurrentTrackIndex,
  currentPlaylistIndex,
}) => {
  return (
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
  )
}

export default PlaylistTile

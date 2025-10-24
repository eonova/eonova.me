import { ArrowRightLeft, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

import { Button } from '~/components/base/button'

interface PlayerControlProps {
  isPlaying: boolean
  playMode: 'order' | 'random' | 'loop'
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  previousTrack: () => void
  togglePlay: () => void
  nextTrack: () => void
  switchPlayMode: () => void
}

const PlayerControl: React.FC<PlayerControlProps> = ({
  isPlaying,
  isMuted,
  playMode,
  setIsMuted,
  previousTrack,
  togglePlay,
  nextTrack,
  switchPlayMode,

}) => {
  return (
    <div className="flex items-center w-full  space-x-4 mb-4 px-2 gap-3 controller">
      <div
        className="h-12 w-8 flex items-center justify-center flex-1 text-gray-400 hover:text-white"
        onClick={switchPlayMode}
      >
        {playMode === 'random' && <Shuffle className="h-4 w-4" />}
        {playMode === 'order' && <ArrowRightLeft className="h-4 w-4" />}
        {playMode === 'loop' && <Repeat className="h-4 w-4" />}
      </div>
      <div
        onClick={previousTrack}
        className="h-12 w-8 p-0 flex-1  flex items-center justify-center text-gray-400 hover:text-white"
      >
        <SkipBack className="h-4 w-4" />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Button
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 p-0"
        >
          {isPlaying
            ? (
                <Pause className="h-4 w-4 dark:text-white text-black" />
              )
            : (
                <Play className="h-4 w-4 dark:text-white text-black ml-0.5" />
              )}
        </Button>
      </div>
      <div
        onClick={nextTrack}
        className="h-12 w-8  flex items-center justify-center flex-1 p-0 text-gray-400 hover:text-white"
      >
        <SkipForward className="h-4 w-4" />
      </div>
      <div
        onClick={() => setIsMuted(!isMuted)}
        className="h-12 w-8 relative flex items-center justify-center flex-1 p-0 text-gray-400 hover:text-white"
      >
        {
          isMuted
            ? <VolumeX className="h-4 w-4" />
            : (
                <>
                  <Volume2 className="h-4 w-4" />
                  <div className="bg-red-500/40 w-full h-1 z-50 rounded-full absolute bottom-0"></div>
                </>
              )
        }

      </div>
    </div>
  )
}

export default PlayerControl

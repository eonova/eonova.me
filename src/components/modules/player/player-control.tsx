import { ArrowRightLeft, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/base/button'
import { Slider } from '~/components/base/slider'
import { cn } from '~/utils'

interface PlayerControlProps {
  isPlaying: boolean
  playMode: 'order' | 'random' | 'loop'
  isMuted: boolean
  volume: number
  setIsMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
  previousTrack: () => void
  togglePlay: () => void
  nextTrack: () => void
  switchPlayMode: () => void
}

const PlayerControl: React.FC<PlayerControlProps> = ({
  isPlaying,
  isMuted,
  volume,
  playMode,
  setIsMuted,
  setVolume,
  previousTrack,
  togglePlay,
  nextTrack,
  switchPlayMode,

}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

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
        className="relative flex items-center flex-col space-x-2 flex-1"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <div
          onClick={() => setIsMuted(!isMuted)}
          className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
        >
          {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </div>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          onValueChange={(value) => {
            const vol = value[0]
            if (vol !== undefined) {
              const newVolume = vol / 100
              setVolume(newVolume)
              if (newVolume > 0 && isMuted) {
                setIsMuted(false)
              }
            }
          }}
          max={100}
          step={1}
          className={cn('flex-1 absolute bottom-[-10] z-1 transition-all duration-100', !showVolumeSlider && 'invisible')}
        />
      </div>
    </div>
  )
}

export default PlayerControl

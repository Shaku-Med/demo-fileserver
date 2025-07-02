'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  playbackRate: number
  showSettings: boolean
  onTogglePlay: () => void
  onSeek: (value: number[]) => void
  onVolumeChange: (value: number[]) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onSkipTime: (seconds: number) => void
  onChangePlaybackRate: (rate: number) => void
  onToggleSettings: () => void
  formatTime: (time: number) => string
  className?: string
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  playbackRate,
  showSettings,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSkipTime,
  onChangePlaybackRate,
  onToggleSettings,
  formatTime,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <Slider
        value={[currentTime]}
        max={duration}
        step={0.1}
        onValueChange={onSeek}
        className="w-full"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePlay}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSkipTime(-10)}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSkipTime(10)}
            className="text-white hover:bg-white/20"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={onVolumeChange}
              className="w-20"
            />
          </div>

          <span className="text-white text-sm ml-4">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSettings}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px]">
                <div className="text-white text-xs mb-2">Playback Speed</div>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onChangePlaybackRate(rate)}
                    className={cn(
                      'block w-full text-left px-2 py-1 text-xs text-white hover:bg-white/20 rounded',
                      playbackRate === rate && 'bg-white/20'
                    )}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VideoControls 
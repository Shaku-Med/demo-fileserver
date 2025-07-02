'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Monitor, Volume2, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoSettingsProps {
  playbackRate: number
  onPlaybackRateChange: (rate: number) => void
  onQualityChange?: (quality: string) => void
  onResetSettings?: () => void
  className?: string
}

const VideoSettings: React.FC<VideoSettingsProps> = ({
  playbackRate,
  onPlaybackRateChange,
  onQualityChange,
  onResetSettings,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  const qualityOptions = ['Auto', '1080p', '720p', '480p', '360p']

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white/20"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-4 min-w-[200px] shadow-xl border border-white/10">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-white text-sm mb-2">
                <RotateCw className="h-4 w-4" />
                Playback Speed
              </div>
              <div className="grid grid-cols-2 gap-1">
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onPlaybackRateChange(rate)}
                    className={cn(
                      'px-3 py-1 text-xs rounded text-white hover:bg-white/20 transition-colors',
                      playbackRate === rate && 'bg-white/20 font-medium'
                    )}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {onQualityChange && (
              <div>
                <div className="flex items-center gap-2 text-white text-sm mb-2">
                  <Monitor className="h-4 w-4" />
                  Quality
                </div>
                <div className="space-y-1">
                  {qualityOptions.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => onQualityChange(quality)}
                      className="block w-full text-left px-3 py-1 text-xs text-white hover:bg-white/20 rounded transition-colors"
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onResetSettings && (
              <div className="pt-2 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetSettings}
                  className="w-full text-white hover:bg-white/20 text-xs"
                >
                  Reset Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoSettings 
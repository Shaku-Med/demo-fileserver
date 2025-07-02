'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Play, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoOverlayProps {
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  onRetry?: () => void
  onPlay?: () => void
  className?: string
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  isLoading,
  hasError,
  errorMessage = 'Failed to load video',
  onRetry,
  onPlay,
  className
}) => {
  if (!isLoading && !hasError) return null

  return (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center bg-black/50',
      className
    )}>
      {isLoading && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="text-white text-sm">Loading video...</p>
        </div>
      )}

      {hasError && (
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <div className="space-y-2">
            <p className="text-white font-medium">Video Error</p>
            <p className="text-white/70 text-sm max-w-xs">{errorMessage}</p>
          </div>
          <div className="flex gap-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            {onPlay && (
              <Button
                variant="default"
                size="sm"
                onClick={onPlay}
                className="bg-white text-black hover:bg-white/90"
              >
                <Play className="h-4 w-4 mr-2" />
                Play Anyway
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoOverlay 
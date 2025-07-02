'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface VideoProgressProps {
  currentTime: number
  duration: number
  onSeek: (value: number[]) => void
  className?: string
}

const VideoProgress: React.FC<VideoProgressProps> = ({
  currentTime,
  duration,
  onSeek,
  className
}) => {
  const [buffered, setBuffered] = useState<TimeRanges | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewTime, setPreviewTime] = useState<number | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !isDragging) return

    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    setPreviewTime(Math.max(0, Math.min(newTime, duration)))
  }

  const handleMouseLeave = () => {
    setPreviewTime(null)
  }

  const getBufferedPercentage = (): number => {
    if (!buffered || buffered.length === 0) return 0

    let bufferedEnd = 0
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
        bufferedEnd = buffered.end(i)
        break
      }
    }
    return (bufferedEnd / duration) * 100
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={progressRef}
        className="relative h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
          style={{ width: `${getBufferedPercentage()}%` }}
        />
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-150"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <Slider
        value={[currentTime]}
        max={duration}
        step={0.1}
        onValueChange={onSeek}
        onValueCommit={() => setIsDragging(false)}
        onPointerDown={() => setIsDragging(true)}
        className="absolute top-0 left-0 w-full opacity-0"
      />

      {previewTime !== null && (
        <div
          className="absolute top-0 transform -translate-y-full bg-black/90 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{
            left: `${(previewTime / duration) * 100}%`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          {formatTime(previewTime)}
        </div>
      )}

      <div className="flex justify-between text-xs text-white/70 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

export default VideoProgress 
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useVideoPlayer } from './useVideoPlayer'
import VideoOverlay from './VideoOverlay'
import HLSPlayer from './HLSPlayer'

interface VideoPlayerProps {
  url: string
  data?: any
  className?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, data, className }) => {
  console.log(url)
  const isHLS = url.includes('.m3u8')
  let params = new URL(`${window.location.origin}${url}`)

  if (isHLS) {
    return <HLSPlayer url={url} data={data} className={className} repo={params.searchParams.get('repo') || ''} length={parseInt(params.searchParams.get('length') || '0')} />
  }

  const {
    videoRef,
    containerRef,
    isLoading,
    hasError,
    errorMessage,
    retry
  } = useVideoPlayer(url)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden',
        className
      )}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        controls
        controlsList="nodownload"
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* <VideoOverlay
        isLoading={isLoading}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={retry}
      /> */}
    </div>
  )
}

export default VideoPlayer 
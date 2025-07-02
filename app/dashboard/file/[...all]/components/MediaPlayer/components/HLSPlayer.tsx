'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { cn } from '@/lib/utils'
import VideoOverlay from './VideoOverlay'

interface HLSPlayerProps {
  url: string
  data?: any
  className?: string
  repo: string
  length: number
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ url, className, repo, length }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLoadedMetadata = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback((event: Event) => {
    let errorMsg = 'Failed to load HLS stream'
    setHasError(true)
    setErrorMessage(errorMsg)
    setIsLoading(false)
  }, [])

  const retry = useCallback(() => {
    setHasError(false)
    setErrorMessage('')
    setIsLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !url) return

    // Always preserve search params
    let finalUrl = url
    try {
      const urlObj = new URL(url, window.location.origin)
      finalUrl = urlObj.toString()
    } catch {}

    // Native HLS support (Safari, some Edge/Chrome)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = finalUrl
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('error', handleError)
      video.addEventListener('loadstart', () => setIsLoading(true))
      video.addEventListener('canplay', () => setIsLoading(false))
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadstart', () => setIsLoading(true))
        video.removeEventListener('canplay', () => setIsLoading(false))
      }
    }

    // hls.js fallback for other browsers
    let hls: Hls | null = null
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        debug: false,
        xhrSetup(xhr, url) {
          try {
            let UL = new URL(url)
            const filename = UL.pathname.split('/').pop()
            let remove_filename = UL.pathname.split('/').splice(0, UL.pathname.split('/').length - 1).join('/')

            const proxiedUrl = `${remove_filename}/${filename}?repo=${repo}&length=${length}`
            if (url.includes('.ts')) {
                xhr.open('GET', proxiedUrl, true)
            }
          }
          catch {
            console.log('Unable to load HLS')
          }
        },
      })
      hls.loadSource(finalUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => setIsLoading(false))
      hls.on(Hls.Events.ERROR, (_, data) => {
        setHasError(true)
        setErrorMessage(data?.details || 'HLS.js error')
        setIsLoading(false)
      })
    } else {
      setHasError(true)
      setErrorMessage('HLS is not supported in this browser')
      setIsLoading(false)
    }
    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [url, handleLoadedMetadata, handleError])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden fixed top-0 left-0 w-full h-full',
        className
      )}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        controlsList="nodownload"
        preload="metadata"
        crossOrigin="anonymous"
        data-hls="true"
        autoPlay
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

export default HLSPlayer 
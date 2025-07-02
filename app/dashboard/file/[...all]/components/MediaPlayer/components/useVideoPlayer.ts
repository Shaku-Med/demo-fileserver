'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  hasError: boolean
  errorMessage: string
  retry: () => void
}

export const useVideoPlayer = (url: string): UseVideoPlayerReturn => {
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
    const video = event.target as HTMLVideoElement
    let errorMsg = 'Failed to load video'
    
    if (video.error) {
      switch (video.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMsg = 'Video playback was aborted'
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMsg = 'Network error occurred while loading video'
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMsg = 'Video decoding error'
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = 'Video format not supported'
          break
        default:
          errorMsg = 'Unknown video error occurred'
      }
    }
    
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
    if (video) {
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
  }, [handleLoadedMetadata, handleError])

  useEffect(() => {
    const video = videoRef.current
    if (video && url) {
      const urlObj = new URL(url, window.location.origin)
      video.src = urlObj.toString()
      video.load()
    }
  }, [url])

  return {
    videoRef,
    containerRef,
    isLoading,
    hasError,
    errorMessage,
    retry
  }
} 
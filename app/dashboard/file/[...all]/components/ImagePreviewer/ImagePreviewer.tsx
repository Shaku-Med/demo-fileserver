'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import ImageViewer from './components/ImageViewer'
import ImageInfoDialog from './components/ImageInfoDialog'
import ThumbnailGallery from './components/ThumbnailGallery'
import { toast } from 'sonner'
import ImageControls from './components/ImageControls'

interface ImageData {
  id: string
  src: string
  alt: string
  name: string
  size: number
  type: string
  dimensions: { width: number; height: number }
  lastModified?: Date
  exif?: {
    camera?: string
    dateTaken?: Date
    location?: string
    iso?: number
    aperture?: string
    shutterSpeed?: string
    focalLength?: string
  }
}

interface ImagePreviewerProps {
    image_data?: object
    image_url?: string
}

const ImagePreviewer = ({ image_data, image_url }: ImagePreviewerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageInfo, setImageInfo] = useState<ImageData | null>(null)
  const [thumbnails, setThumbnails] = useState<ImageData[]>([])
  const [isProgrammaticZoom, setIsProgrammaticZoom] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  useEffect(() => {
    const mockImageData: ImageData = {
      id: '1',
      src: image_url || '',
      alt: 'Sample Image',
      name: 'sample-image.jpg',
      size: 2048576,
      type: 'image/jpeg',
      dimensions: { width: 1920, height: 1080 },
      lastModified: new Date(),
      exif: {
        camera: 'Canon EOS R5',
        dateTaken: new Date('2024-01-15'),
        iso: 100,
        aperture: '2.8',
        shutterSpeed: '1/500',
        focalLength: '50'
      }
    }

    setImageInfo(mockImageData)
    setThumbnails([mockImageData])
  }, [])



  const handleNext = useCallback(() => {
    if (currentImageIndex < thumbnails.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
      setZoom(1)
      setRotation(0)
      if (transformRef.current) {
        transformRef.current.resetTransform(200)
      }
    }
  }, [currentImageIndex, thumbnails.length])

  const handlePrev = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
      setZoom(1)
      setRotation(0)
      if (transformRef.current) {
        transformRef.current.resetTransform(200)
      }
    }
  }, [currentImageIndex])

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentImageIndex(index)
    setZoom(1)
    setRotation(0)
    if (transformRef.current) {
      transformRef.current.resetTransform(200)
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (e.ctrlKey || e.metaKey) {
          handlePrev()
        }
        break
      case 'ArrowRight':
        if (e.ctrlKey || e.metaKey) {
          handleNext()
        }
        break
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen()
          setIsFullscreen(false)
        }
        break
    }
  }, [handleNext, handlePrev])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
    if (transformRef.current) {
      try {
        transformRef.current.setTransform(0, 0, newZoom, 200)
      } catch (error) {
        console.warn('Transform not ready yet:', error)
      }
    }
  }, [])

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 0.2, 3)
    handleZoomChange(newZoom)
  }, [zoom, handleZoomChange])

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 0.2, 0.1)
    handleZoomChange(newZoom)
  }, [zoom, handleZoomChange])

  const handleRotateLeft = useCallback(() => {
    setRotation(prev => (prev - 90) % 360)
  }, [])

  const handleRotateRight = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setRotation(0)
    if (transformRef.current) {
      transformRef.current.resetTransform(200)
    }
  }, [])

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])





  const currentImage = thumbnails[currentImageIndex]

  const handleDownload = useCallback(() => {
    if (currentImage) {
      const link = document.createElement('a')
      link.href = currentImage.src
      link.download = currentImage.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [currentImage])

  if (!currentImage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading image...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-background ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <ImageViewer
        src={currentImage.src}
        alt={currentImage.alt}
        rotation={rotation}
        isProgrammaticZoom={isProgrammaticZoom}
        transformRef={transformRef}
        onError={() => {
          toast.error('Failed to load image.')
        }}
      />



      <ThumbnailGallery
        thumbnails={thumbnails}
        currentIndex={currentImageIndex}
        onThumbnailClick={handleThumbnailClick}
        visible={thumbnails.length > 1}
      />

      <ImageInfoDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        imageInfo={currentImage}
      />

      {isFullscreen && (
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2">
          <p className="text-sm text-muted-foreground">
            Press ESC to exit fullscreen
          </p>
        </div>
      )}
      <ImageControls
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onFullscreen={handleFullscreen}
        onReset={handleReset}
        onDownload={handleDownload}
        onInfo={() => setShowInfoDialog(true)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        hasNext={currentImageIndex < thumbnails.length - 1}
        hasPrev={currentImageIndex > 0}
        onNext={handleNext}
        onPrev={handlePrev}
        imageIndex={currentImageIndex}
        totalImages={thumbnails.length}
      />    
    </div>
  )
}

export default ImagePreviewer
